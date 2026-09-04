import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.documento import Documento
from app.models.propiedad import Propiedad


class CRUDDocumento:
    def get(self, db: Session, id: uuid.UUID) -> Documento | None:
        stmt = (
            select(Documento)
            .where(Documento.id == id)
            .options(selectinload(Documento.propiedades))
        )
        return db.scalars(stmt).first()

    def get_multi_by_propiedad(self, db: Session, *, propiedad_id: uuid.UUID) -> list[Documento]:
        stmt = (
            select(Documento)
            .join(Documento.propiedades)
            .where(Propiedad.id == propiedad_id)
            .options(selectinload(Documento.propiedades))
            .order_by(Documento.creado_en.desc())
        )
        return list(db.scalars(stmt).unique().all())

    def create(
        self,
        db: Session,
        *,
        nombre_archivo: str,
        tipo_contenido: str,
        contenido: bytes,
        descripcion: str | None,
        propiedad_ids: list[uuid.UUID],
    ) -> Documento:
        propiedades = list(
            db.scalars(select(Propiedad).where(Propiedad.id.in_(propiedad_ids))).all()
        )
        db_obj = Documento(
            nombre_archivo=nombre_archivo,
            tipo_contenido=tipo_contenido,
            tamano_bytes=len(contenido),
            contenido=contenido,
            descripcion=descripcion,
            propiedades=propiedades,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: uuid.UUID) -> Documento | None:
        db_obj = db.get(Documento, id)
        if db_obj is not None:
            db.delete(db_obj)
            db.commit()
        return db_obj


documento = CRUDDocumento()
