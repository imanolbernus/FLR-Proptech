from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.contrato import Contrato
from app.schemas.contrato import ContratoCreate, ContratoUpdate


class CRUDContrato(CRUDBase[Contrato, ContratoCreate, ContratoUpdate]):
    def get_multi_by_propiedad(
        self, db: Session, *, propiedad_id, skip: int = 0, limit: int = 100
    ) -> list[Contrato]:
        stmt = (
            select(Contrato)
            .where(Contrato.propiedad_id == propiedad_id)
            .order_by(Contrato.fecha_inicio.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(db.scalars(stmt).all())

    def get_activo_por_propiedad(self, db: Session, *, propiedad_id) -> Contrato | None:
        stmt = select(Contrato).where(
            Contrato.propiedad_id == propiedad_id, Contrato.estado == "activo"
        )
        return db.scalars(stmt).first()


contrato = CRUDContrato(Contrato)
