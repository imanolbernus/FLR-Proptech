import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.pago import pago as crud_pago
from app.schemas.enums import PaymentStatus
from app.schemas.pago import PagoCreate, PagoRead, PagoUpdate

router = APIRouter(prefix="/pagos", tags=["Pagos"])


@router.get("/", response_model=list[PagoRead])
def listar_pagos(
    skip: int = 0,
    limit: int = 100,
    contrato_id: uuid.UUID | None = Query(default=None),
    estado: PaymentStatus | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if contrato_id:
        return crud_pago.get_multi_by_contrato(db, contrato_id=contrato_id, skip=skip, limit=limit)
    if estado:
        return crud_pago.get_multi_by_estado(db, estado=estado.value, skip=skip, limit=limit)
    return crud_pago.get_multi(db, skip=skip, limit=limit)


@router.post("/", response_model=PagoRead, status_code=status.HTTP_201_CREATED)
def crear_pago(pago_in: PagoCreate, db: Session = Depends(get_db)):
    return crud_pago.create(db, obj_in=pago_in)


@router.get("/{pago_id}", response_model=PagoRead)
def obtener_pago(pago_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_pago.get(db, pago_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return db_obj


@router.patch("/{pago_id}", response_model=PagoRead)
def actualizar_pago(pago_id: uuid.UUID, pago_in: PagoUpdate, db: Session = Depends(get_db)):
    db_obj = crud_pago.get(db, pago_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return crud_pago.update(db, db_obj=db_obj, obj_in=pago_in)


@router.delete("/{pago_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pago(pago_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_pago.remove(db, id=pago_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
