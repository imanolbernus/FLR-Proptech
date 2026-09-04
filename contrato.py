import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.schemas.enums import UserRole


class UsuarioBase(BaseModel):
    nombre: str
    email: EmailStr
    rol: UserRole = UserRole.property_manager
    telefono: str | None = None
    activo: bool = True


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioUpdate(BaseModel):
    nombre: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    rol: UserRole | None = None
    telefono: str | None = None
    activo: bool | None = None


class UsuarioRead(UsuarioBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
