"""
Script de siembra (seed) con los datos REALES del portafolio FLR, tomados de
los resúmenes de contratos ya procesados (proyecto "FLR" en Claude):
Cuitláhuac 88-A, Cuitláhuac 88-B, Cuitláhuac 94, Francisco Novoa 41 y
Francisco Novoa 43. Arrendador único: Sr. Federico López Rodea.

Es idempotente: se puede correr varias veces sin duplicar registros (busca
por nombre_referencia / nombre_razon_social / email antes de insertar).

IMPORTANTE — datos NO documentados que se dejan explícitamente en blanco o
como placeholder (no se inventan):
  - RFC del arrendador, de Grupo Industrial de Alimentos San Fernando y de
    los inquilinos persona física: ningún resumen de contrato los reporta.
  - Email/teléfono de contacto reales: no están en los resúmenes; se usa un
    email de acceso al sistema como placeholder para el usuario admin.
  - superficie_m2 de los 5 inmuebles: ningún contrato revisado la reporta
    (ver "Pendiente transversal" en el resumen general del portafolio).
  - Todos los contratos sembrados aquí son el ÚLTIMO contrato REAL conocido
    de cada inmueble (no el historial completo de hasta 11 contratos por
    inmueble) y se marcan como 'vencido' porque, a la fecha, ningún inmueble
    tiene un contrato 2026 firmado — todos están en holdover/prórroga
    voluntaria según la cláusula de incremento INPC de cada contrato.

Uso:
    cd backend
    source .venv/bin/activate
    python -m app.db.seed
"""
from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.contrato import Contrato
from app.models.inquilino import Inquilino
from app.models.propiedad import Propiedad
from app.models.usuario import Usuario


def get_or_create_usuario(db: Session) -> Usuario:
    # Credenciales de acceso al sistema (no son datos de ningún contrato, son
    # solo el login de la app). La contraseña se re-escribe en cada arranque
    # a este valor conocido -- es la cuenta admin única de un sistema mono-
    # usuario, así que es seguro dejarlo idempotente en vez de solo "crear si
    # no existe". Cámbiala después desde /docs (PATCH /usuarios/{id}) o pide
    # que se construya una pantalla de "cambiar contraseña".
    # Nota: no usar dominios "reservados" (.local, .test, .invalid, etc.) --
    # pydantic's EmailStr los rechaza al serializar la respuesta de /auth/me.
    email = "federico.lopez@flr-proptech.app"
    password = "G9thcej5oHSbVz"

        existente = db.query(Usuario).filter(Usuario.email == email).first()
    if existente:
        existente.nombre = "FLR"
        existente.password_hash = get_password_hash(password)
        db.add(existente)
        db.commit()
        db.refresh(existente)
        return existente

    usuario = Usuario(
        nombre="Federico López Rodea",
        email=email,
        password_hash=get_password_hash(password),
        rol="admin",
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def get_or_create_propiedad(db: Session, *, usuario: Usuario, **kwargs) -> Propiedad:
    existente = db.query(Propiedad).filter(
        Propiedad.nombre_referencia == kwargs["nombre_referencia"]
    ).first()
    if existente:
        return existente
    propiedad = Propiedad(usuario_id=usuario.id, **kwargs)
    db.add(propiedad)
    db.commit()
    db.refresh(propiedad)
    return propiedad


def get_or_create_inquilino(db: Session, **kwargs) -> Inquilino:
    existente = db.query(Inquilino).filter(
        Inquilino.nombre_razon_social == kwargs["nombre_razon_social"]
    ).first()
    if existente:
        return existente
    inquilino = Inquilino(**kwargs)
    db.add(inquilino)
    db.commit()
    db.refresh(inquilino)
    return inquilino


def get_or_create_contrato(db: Session, *, propiedad: Propiedad, inquilino: Inquilino, **kwargs) -> Contrato:
    existente = db.query(Contrato).filter(
        Contrato.propiedad_id == propiedad.id,
        Contrato.fecha_inicio == kwargs["fecha_inicio"],
    ).first()
    if existente:
        return existente
    contrato = Contrato(propiedad_id=propiedad.id, inquilino_id=inquilino.id, **kwargs)
    db.add(contrato)
    db.commit()
    db.refresh(contrato)
    return contrato


def seed() -> None:
    db = SessionLocal()
    try:
        federico = get_or_create_usuario(db)

        grupo_san_fernando = get_or_create_inquilino(
            db,
            tipo_persona="persona_moral",
            nombre_razon_social="Grupo Industrial de Alimentos San Fernando, S.A. de C.V.",
            representante_legal="Iñaki Goicoechea San Martín",
            notas="Mismo inquilino en Cuitláhuac 88-B, Francisco Novoa 41 y Francisco Novoa 43.",
        )
        nicolas_sanchez = get_or_create_inquilino(
            db,
            tipo_persona="persona_fisica",
            nombre_razon_social="Nicolás Sánchez Hernández",
            direccion="República de Uruguay No. 121, Col. Centro, CDMX",
            notas="Fiador: Saturnino Nicolás Sánchez Hernández, garantiza con inmueble en "
            "República de Uruguay No. 145, Col. Centro, Alcaldía Cuauhtémoc, CDMX.",
        )
        juana_perez = get_or_create_inquilino(
            db,
            tipo_persona="persona_fisica",
            nombre_razon_social="Juana Violeta Pérez Alegría",
            notas="Fiador: Félix Asbún Reyes, garantiza con inmueble en Calle Vicente Villada "
            "130, Col. Villa de Guadalupe, CDMX. Inquilina desde jun-2019; inquilina anterior "
            "del inmueble (2015-2016) fue Mara Sport, S.A. de C.V. (no sembrada, sin contrato vigente).",
        )

        # ------------------------------------------------------------------
        # 1. Cuitláhuac 88-B
        # ------------------------------------------------------------------
        p_88b = get_or_create_propiedad(
            db,
            usuario=federico,
            nombre_referencia="Cuitláhuac 88-B",
            calle="Cuitláhuac",
            numero_exterior="88",
            numero_interior="B",
            tipo="bodega_oficina",
            renta_base=Decimal("9000.00"),
            renta_incluye_iva=True,
            notas="Renta más baja del portafolio. Depósito y seguro contra todo riesgo "
            "pactados en $0.00 en los 11 contratos revisados (2014-2025).",
        )
        get_or_create_contrato(
            db,
            propiedad=p_88b,
            inquilino=grupo_san_fernando,
            fecha_inicio=date(2025, 1, 1),
            fecha_fin=date(2025, 12, 31),
            renta_mensual=Decimal("9000.00"),
            renta_incluye_iva=True,
            deposito_garantia=Decimal("0"),
            penalizacion_mora_diaria=Decimal("10.00"),
            ajuste_indexado_inpc=True,
            margen_ajuste_pp=Decimal("20.00"),
            uso_permitido="bodega y oficinas",
            jurisdiccion="Tribunales de la Ciudad de México",
            estado="vencido",
            notas="Último contrato real conocido. Sin contrato 2026 firmado; continúa en "
            "prórroga voluntaria bajo la cláusula INPC + 20 pp.",
        )

        # ------------------------------------------------------------------
        # 2. Cuitláhuac 88-A
        # ------------------------------------------------------------------
        p_88a = get_or_create_propiedad(
            db,
            usuario=federico,
            nombre_referencia="Cuitláhuac 88-A",
            calle="Cuitláhuac",
            numero_exterior="88",
            numero_interior="A",
            colonia="Aragón La Villa",
            tipo="bodega",
            renta_base=Decimal("80440.00"),
            renta_incluye_iva=True,
            notas="Renta más alta del portafolio. Solo hay 2 contratos disponibles "
            "(dic-2021 y ene-2023); no hay contratos anteriores a 2021.",
        )
        get_or_create_contrato(
            db,
            propiedad=p_88a,
            inquilino=nicolas_sanchez,
            fecha_inicio=date(2023, 1, 1),
            fecha_fin=date(2023, 12, 31),
            renta_mensual=Decimal("80440.00"),
            renta_incluye_iva=True,
            deposito_garantia=Decimal("61000.00"),
            penalizacion_mora_diaria=Decimal("105.00"),
            ajuste_indexado_inpc=True,
            margen_ajuste_pp=Decimal("5.00"),
            uso_permitido="almacenamiento y distribución de telas",
            estado="vencido",
            notas="Último contrato real conocido. Diciembre 2022 queda sin contrato "
            "explícito (probable continuación voluntaria, pendiente confirmar). Sin "
            "contrato posterior a ene-2023 localizado.",
        )

        # ------------------------------------------------------------------
        # 3. Cuitláhuac 94
        # ------------------------------------------------------------------
        p_94 = get_or_create_propiedad(
            db,
            usuario=federico,
            nombre_referencia="Cuitláhuac 94",
            calle="Cuitláhuac",
            numero_exterior="94",
            colonia="Aragón La Villa",
            tipo="bodega",
            renta_base=Decimal("69015.00"),
            renta_incluye_iva=True,
            notas="Dos inquilinos en el historial: Mara Sport, S.A. de C.V. (2015-2016, "
            "no sembrado) y Juana Violeta Pérez Alegría (2019-2023, inquilina vigente).",
        )
        get_or_create_contrato(
            db,
            propiedad=p_94,
            inquilino=juana_perez,
            fecha_inicio=date(2023, 1, 1),
            fecha_fin=date(2023, 12, 31),
            renta_mensual=Decimal("69015.00"),
            renta_incluye_iva=True,
            deposito_garantia=Decimal("60000.00"),
            penalizacion_mora_diaria=Decimal("100.00"),
            ajuste_indexado_inpc=True,
            margen_ajuste_pp=Decimal("5.00"),
            uso_permitido="almacenamiento de aparatos de ejercicio",
            estado="vencido",
            notas="Último contrato real conocido. Depósito nunca se actualizó pese al "
            "incremento de renta. Faltan contratos de 2020-2021 en el expediente.",
        )

        # ------------------------------------------------------------------
        # 4. Francisco Novoa 41
        # ------------------------------------------------------------------
        p_novoa41 = get_or_create_propiedad(
            db,
            usuario=federico,
            nombre_referencia="Francisco Novoa 41",
            calle="Francisco Novoa",
            numero_exterior="41",
            colonia="Aragón",
            tipo="bodega_oficina",
            renta_base=Decimal("24234.00"),
            renta_incluye_iva=True,
            notas="Comparte entrada (Netzahualcóyotl No. 176, Col. Aragón) con Francisco "
            "Novoa 43. Mismo arrendatario que Cuitláhuac 88-B y Francisco Novoa 43.",
        )
        get_or_create_contrato(
            db,
            propiedad=p_novoa41,
            inquilino=grupo_san_fernando,
            fecha_inicio=date(2025, 1, 1),
            fecha_fin=date(2025, 12, 31),
            renta_mensual=Decimal("24234.00"),
            renta_incluye_iva=True,
            deposito_garantia=Decimal("0"),
            penalizacion_mora_diaria=Decimal("15.00"),
            ajuste_indexado_inpc=True,
            margen_ajuste_pp=Decimal("20.00"),
            uso_permitido="bodega y oficinas",
            jurisdiccion="Tribunales de la Ciudad de México",
            estado="vencido",
            notas="Último contrato real conocido. Sin contrato 2026 firmado; continúa en "
            "prórroga voluntaria bajo la cláusula INPC + 20 pp.",
        )

        # ------------------------------------------------------------------
        # 5. Francisco Novoa 43
        # ------------------------------------------------------------------
        p_novoa43 = get_or_create_propiedad(
            db,
            usuario=federico,
            nombre_referencia="Francisco Novoa 43",
            calle="Francisco Novoa",
            numero_exterior="43",
            colonia="Aragón",
            tipo="bodega_oficina",
            renta_base=Decimal("44121.00"),
            renta_incluye_iva=True,
            notas="Casa No. 43. Comparte entrada (Netzahualcóyotl No. 176, Col. Aragón) "
            "con Francisco Novoa 41.",
        )
        get_or_create_contrato(
            db,
            propiedad=p_novoa43,
            inquilino=grupo_san_fernando,
            fecha_inicio=date(2025, 1, 1),
            fecha_fin=date(2025, 12, 31),
            renta_mensual=Decimal("44121.00"),
            renta_incluye_iva=True,
            deposito_garantia=Decimal("0"),
            penalizacion_mora_diaria=Decimal("18.00"),
            ajuste_indexado_inpc=True,
            margen_ajuste_pp=Decimal("20.00"),
            uso_permitido="bodega y oficinas",
            jurisdiccion="Tribunales de la Ciudad de México",
            estado="vencido",
            notas="Último contrato real conocido. La mora diaria subió de $15.00 a "
            "$18.00 entre 2024 y 2025. Sin contrato 2026 firmado (hay borrador estimado "
            "en $46,027.00/mes pendiente de confirmar y firmar).",
        )

        print("Seed completado: 1 usuario, 5 propiedades, 3 inquilinos, 5 contratos.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
