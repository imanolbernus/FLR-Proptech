import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.ticket_mantenimiento import ticket_mantenimiento as crud_ticket
from app.schemas.ticket_mantenimiento import (
    TicketMantenimientoCreate,
    TicketMantenimientoRead,
    TicketMantenimientoUpdate,
)

router = APIRouter(prefix="/tickets", tags=["Tickets de Mantenimiento"])


@router.get("/", response_model=list[TicketMantenimientoRead])
def listar_tickets(
    skip: int = 0,
    limit: int = 100,
    propiedad_id: uuid.UUID | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if propiedad_id:
        return crud_ticket.get_multi_by_propiedad(db, propiedad_id=propiedad_id, skip=skip, limit=limit)
    return crud_ticket.get_multi(db, skip=skip, limit=limit)


@router.post("/", response_model=TicketMantenimientoRead, status_code=status.HTTP_201_CREATED)
def crear_ticket(ticket_in: TicketMantenimientoCreate, db: Session = Depends(get_db)):
    return crud_ticket.create(db, obj_in=ticket_in)


@router.get("/{ticket_id}", response_model=TicketMantenimientoRead)
def obtener_ticket(ticket_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_ticket.get(db, ticket_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return db_obj


@router.patch("/{ticket_id}", response_model=TicketMantenimientoRead)
def actualizar_ticket(ticket_id: uuid.UUID, ticket_in: TicketMantenimientoUpdate, db: Session = Depends(get_db)):
    db_obj = crud_ticket.get(db, ticket_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    return crud_ticket.update(db, db_obj=db_obj, obj_in=ticket_in)


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ticket(ticket_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_ticket.remove(db, id=ticket_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
