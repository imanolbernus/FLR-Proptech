from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.propiedad import Propiedad
from app.schemas.propiedad import PropiedadCreate, PropiedadUpdate


class CRUDPropiedad(CRUDBase[Propiedad, PropiedadCreate, PropiedadUpdate]):
    def get_multi_by_estado(
        self, db: Session, *, estado_ocupacion: str, skip: int = 0, limit: int = 100
    ) -> list[Propiedad]:
        stmt = (
            select(Propiedad)
            .where(Propiedad.estado_ocupacion == estado_ocupacion)
            .offset(skip)
            .limit(limit)
        )
        return list(db.scalars(stmt).all())


propiedad = CRUDPropiedad(Propiedad)
