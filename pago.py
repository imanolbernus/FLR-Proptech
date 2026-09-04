import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.enums import TenantType


class InquilinoBase(BaseModel):
    tipo_persona: TenantType = TenantType.persona_fisica
    nombre_razon_social: str
    rfc: str | None = None
    representante_legal: str | None = None
    email: str | None = None
    telefono: str | None = None
    direccion: str | None = None
    notas: str | None = None


class InquilinoCreate(InquilinoBase):
    pass


class InquilinoUpdate(BaseModel):
    tipo_persona: TenantType | None = None
    nombre_razon_social: str | None = None
    rfc: str | None = None
    representante_legal: str | None = None
    email: str | None = None
    telefono: str | None = None
    direccion: str | None = None
    notas: str | None = None


class InquilinoRead(InquilinoBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
