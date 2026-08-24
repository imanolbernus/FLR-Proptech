import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.schemas.enums import PropertyStatus, PropertyType


class PropiedadBase(BaseModel):
    nombre_referencia: str
    calle: str
    numero_exterior: str | None = None
    numero_interior: str | None = None
    colonia: str | None = None
    ciudad: str = "Ciudad de México"
    estado_republica: str = "Ciudad de México"
    codigo_postal: str | None = None
    pais: str = "México"
    tipo: PropertyType
    estado_ocupacion: PropertyStatus = PropertyStatus.disponible
    superficie_m2: Decimal | None = None
    renta_base: Decimal
    renta_incluye_iva: bool = True
    notas: str | None = None
    usuario_id: uuid.UUID | None = None


class PropiedadCreate(PropiedadBase):
    pass


class PropiedadUpdate(BaseModel):
    nombre_referencia: str | None = None
    calle: str | None = None
    numero_exterior: str | None = None
    numero_interior: str | None = None
    colonia: str | None = None
    ciudad: str | None = None
    estado_republica: str | None = None
    codigo_postal: str | None = None
    pais: str | None = None
    tipo: PropertyType | None = None
    estado_ocupacion: PropertyStatus | None = None
    superficie_m2: Decimal | None = None
    renta_base: Decimal | None = None
    renta_incluye_iva: bool | None = None
    notas: str | None = None
    usuario_id: uuid.UUID | None = None


class PropiedadRead(PropiedadBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
