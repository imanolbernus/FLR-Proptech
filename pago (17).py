from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.pago import Pago
from app.schemas.pago import PagoCreate, PagoUpdate


class CRUDPago(CRUDBase[Pago, PagoCreate, PagoUpdate]):
    def get_multi_by_contrato(
        self, db: Session, *, contrato_id, skip: int = 0, limit: int = 100
    ) -> list[Pago]:
        stmt = (
            select(Pago)
            .where(Pago.contrato_id == contrato_id)
            .order_by(Pago.fecha_vencimiento.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(db.scalars(stmt).all())

    def get_multi_by_estado(
        self, db: Session, *, estado: str, skip: int = 0, limit: int = 100
    ) -> list[Pago]:
        stmt = select(Pago).where(Pago.estado == estado).offset(skip).limit(limit)
        return list(db.scalars(stmt).all())


pago = CRUDPago(Pago)
