import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.inquilino import inquilino as crud_inquilino
from app.schemas.inquilino import InquilinoCreate, InquilinoRead, InquilinoUpdate

router = APIRouter(prefix="/inquilinos", tags=["Inquilinos"])


@router.get("/", response_model=list[InquilinoRead])
def listar_inquilinos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_inquilino.get_multi(db, skip=skip, limit=limit)


@router.post("/", response_model=InquilinoRead, status_code=status.HTTP_201_CREATED)
def crear_inquilino(inquilino_in: InquilinoCreate, db: Session = Depends(get_db)):
    return crud_inquilino.create(db, obj_in=inquilino_in)


@router.get("/{inquilino_id}", response_model=InquilinoRead)
def obtener_inquilino(inquilino_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_inquilino.get(db, inquilino_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Inquilino no encontrado")
    return db_obj


@router.patch("/{inquilino_id}", response_model=InquilinoRead)
def actualizar_inquilino(inquilino_id: uuid.UUID, inquilino_in: InquilinoUpdate, db: Session = Depends(get_db)):
    db_obj = crud_inquilino.get(db, inquilino_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Inquilino no encontrado")
    return crud_inquilino.update(db, db_obj=db_obj, obj_in=inquilino_in)


@router.delete("/{inquilino_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_inquilino(inquilino_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_inquilino.remove(db, id=inquilino_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Inquilino no encontrado")
