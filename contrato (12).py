import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

property_type_enum = PGEnum(
    "bodega", "oficina", "bodega_oficina", "local_comercial", "nave_industrial",
    "terreno", "departamento", "casa", "otro",
    name="property_type", create_type=False,
)
property_status_enum = PGEnum(
    "disponible", "ocupada", "en_mantenimiento", "inactiva",
    name="property_status", create_type=False,
)


class Propiedad(Base):
    __tablename__ = "propiedades"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    usuario_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="SET NULL")
    )
    nombre_referencia: Mapped[str] = mapped_column(String(150), nullable=False)
    calle: Mapped[str] = mapped_column(String(200), nullable=False)
    numero_exterior: Mapped[str | None] = mapped_column(String(20))
    numero_interior: Mapped[str | None] = mapped_column(String(20))
    colonia: Mapped[str | None] = mapped_column(String(150))
    ciudad: Mapped[str] = mapped_column(String(100), nullable=False, server_default="Ciudad de México")
    estado_republica: Mapped[str] = mapped_column(String(100), nullable=False, server_default="Ciudad de México")
    codigo_postal: Mapped[str | None] = mapped_column(String(10))
    pais: Mapped[str] = mapped_column(String(60), nullable=False, server_default="México")
    tipo: Mapped[str] = mapped_column(property_type_enum, nullable=False)
    estado_ocupacion: Mapped[str] = mapped_column(
        property_status_enum, nullable=False, server_default="disponible"
    )
    superficie_m2: Mapped[float | None] = mapped_column(Numeric(10, 2))
    renta_base: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    renta_incluye_iva: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    notas: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    usuario: Mapped["Usuario | None"] = relationship(back_populates="propiedades")
    # Nota: en la BD, contratos.propiedad_id es ON DELETE RESTRICT (se conserva
    # el historial), por lo que aquí NO se usa cascade delete-orphan.
    contratos: Mapped[list["Contrato"]] = relationship(back_populates="propiedad")
    # tickets_mantenimiento.propiedad_id sí es ON DELETE CASCADE en la BD.
    tickets: Mapped[list["TicketMantenimiento"]] = relationship(
        back_populates="propiedad", cascade="all, delete-orphan"
    )
    documentos: Mapped[list["Documento"]] = relationship(
        secondary="documento_propiedades", back_populates="propiedades"
    )
