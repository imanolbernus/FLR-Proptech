import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.contrato import contrato as crud_contrato
from app.schemas.contrato import ContratoCreate, ContratoRead, ContratoUpdate

router = APIRouter(prefix="/contratos", tags=["Contratos"])


@router.get("/", response_model=list[ContratoRead])
def listar_contratos(
    skip: int = 0,
    limit: int = 100,
    propiedad_id: uuid.UUID | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if propiedad_id:
        return crud_contrato.get_multi_by_propiedad(db, propiedad_id=propiedad_id, skip=skip, limit=limit)
    return crud_contrato.get_multi(db, skip=skip, limit=limit)


@router.post("/", response_model=ContratoRead, status_code=status.HTTP_201_CREATED)
def crear_contrato(contrato_in: ContratoCreate, db: Session = Depends(get_db)):
    if contrato_in.estado.value == "activo" and crud_contrato.get_activo_por_propiedad(
        db, propiedad_id=contrato_in.propiedad_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Ya existe un contrato activo para esta propiedad. Márcalo como "
            "'vencido' o 'renovado' antes de crear uno nuevo activo.",
        )
    return crud_contrato.create(db, obj_in=contrato_in)


@router.get("/{contrato_id}", response_model=ContratoRead)
def obtener_contrato(contrato_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_contrato.get(db, contrato_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
    return db_obj


@router.patch("/{contrato_id}", response_model=ContratoRead)
def actualizar_contrato(contrato_id: uuid.UUID, contrato_in: ContratoUpdate, db: Session = Depends(get_db)):
    db_obj = crud_contrato.get(db, contrato_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
    return crud_contrato.update(db, db_obj=db_obj, obj_in=contrato_in)


@router.delete("/{contrato_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_contrato(contrato_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_contrato.remove(db, id=contrato_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Contrato no encontrado")
