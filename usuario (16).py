from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate


class CRUDUsuario(CRUDBase[Usuario, UsuarioCreate, UsuarioUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Usuario | None:
        stmt = select(Usuario).where(Usuario.email == email)
        return db.scalars(stmt).first()

    def create(self, db: Session, *, obj_in: UsuarioCreate) -> Usuario:
        data = obj_in.model_dump(exclude={"password"})
        db_obj = Usuario(**data, password_hash=get_password_hash(obj_in.password))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Usuario, obj_in: UsuarioUpdate) -> Usuario:
        update_data = obj_in.model_dump(exclude_unset=True, exclude={"password"})
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        if obj_in.password:
            db_obj.password_hash = get_password_hash(obj_in.password)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, email: str, password: str) -> Usuario | None:
        user = self.get_by_email(db, email=email)
        if not user or not verify_password(password, user.password_hash):
            return None
        return user


usuario = CRUDUsuario(Usuario)
