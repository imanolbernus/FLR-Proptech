import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.propiedad import propiedad as crud_propiedad
from app.schemas.enums import PropertyStatus
from app.schemas.propiedad import PropiedadCreate, PropiedadRead, PropiedadUpdate

router = APIRouter(prefix="/propiedades", tags=["Propiedades"])


@router.get("/", response_model=list[PropiedadRead])
def listar_propiedades(
    skip: int = 0,
    limit: int = 100,
    estado_ocupacion: PropertyStatus | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if estado_ocupacion:
        return crud_propiedad.get_multi_by_estado(
            db, estado_ocupacion=estado_ocupacion.value, skip=skip, limit=limit
        )
    return crud_propiedad.get_multi(db, skip=skip, limit=limit)


@router.post("/", response_model=PropiedadRead, status_code=status.HTTP_201_CREATED)
def crear_propiedad(propiedad_in: PropiedadCreate, db: Session = Depends(get_db)):
    return crud_propiedad.create(db, obj_in=propiedad_in)


@router.get("/{propiedad_id}", response_model=PropiedadRead)
def obtener_propiedad(propiedad_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_propiedad.get(db, propiedad_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    return db_obj


@router.patch("/{propiedad_id}", response_model=PropiedadRead)
def actualizar_propiedad(propiedad_id: uuid.UUID, propiedad_in: PropiedadUpdate, db: Session = Depends(get_db)):
    db_obj = crud_propiedad.get(db, propiedad_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    return crud_propiedad.update(db, db_obj=db_obj, obj_in=propiedad_in)


@router.delete("/{propiedad_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_propiedad(propiedad_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_propiedad.remove(db, id=propiedad_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
