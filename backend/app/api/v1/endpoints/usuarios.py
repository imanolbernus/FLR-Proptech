import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.usuario import usuario as crud_usuario
from app.schemas.usuario import UsuarioCreate, UsuarioRead, UsuarioUpdate

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("/", response_model=list[UsuarioRead])
def listar_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_usuario.get_multi(db, skip=skip, limit=limit)


@router.post("/", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def crear_usuario(usuario_in: UsuarioCreate, db: Session = Depends(get_db)):
    if crud_usuario.get_by_email(db, email=usuario_in.email):
        raise HTTPException(status_code=400, detail="Ya existe un usuario con ese email")
    return crud_usuario.create(db, obj_in=usuario_in)


@router.get("/{usuario_id}", response_model=UsuarioRead)
def obtener_usuario(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_usuario.get(db, usuario_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_obj


@router.patch("/{usuario_id}", response_model=UsuarioRead)
def actualizar_usuario(usuario_id: uuid.UUID, usuario_in: UsuarioUpdate, db: Session = Depends(get_db)):
    db_obj = crud_usuario.get(db, usuario_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return crud_usuario.update(db, db_obj=db_obj, obj_in=usuario_in)


@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(usuario_id: uuid.UUID, db: Session = Depends(get_db)):
    db_obj = crud_usuario.remove(db, id=usuario_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
