from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.ticket_mantenimiento import TicketMantenimiento
from app.schemas.ticket_mantenimiento import TicketMantenimientoCreate, TicketMantenimientoUpdate


class CRUDTicketMantenimiento(
    CRUDBase[TicketMantenimiento, TicketMantenimientoCreate, TicketMantenimientoUpdate]
):
    def get_multi_by_propiedad(
        self, db: Session, *, propiedad_id, skip: int = 0, limit: int = 100
    ) -> list[TicketMantenimiento]:
        stmt = (
            select(TicketMantenimiento)
            .where(TicketMantenimiento.propiedad_id == propiedad_id)
            .order_by(TicketMantenimiento.fecha_apertura.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(db.scalars(stmt).all())


ticket_mantenimiento = CRUDTicketMantenimiento(TicketMantenimiento)
