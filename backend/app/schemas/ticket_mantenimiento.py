import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, model_validator

from app.schemas.enums import TicketPriority, TicketStatus


class TicketMantenimientoBase(BaseModel):
    propiedad_id: uuid.UUID
    contrato_id: uuid.UUID | None = None
    reportado_por: uuid.UUID | None = None
    titulo: str
    descripcion: str
    prioridad: TicketPriority = TicketPriority.media
    estado: TicketStatus = TicketStatus.abierto
    asignado_a: str | None = None
    costo_estimado: Decimal | None = None
    costo_real: Decimal | None = None
    fecha_apertura: date | None = None
    fecha_cierre: date | None = None

    @model_validator(mode="after")
    def validar_cierre(self) -> "TicketMantenimientoBase":
        if self.estado in (TicketStatus.resuelto, TicketStatus.cancelado) and self.fecha_cierre is None:
            raise ValueError("fecha_cierre es obligatoria cuando el ticket está resuelto o cancelado")
        return self


class TicketMantenimientoCreate(TicketMantenimientoBase):
    pass


class TicketMantenimientoUpdate(BaseModel):
    propiedad_id: uuid.UUID | None = None
    contrato_id: uuid.UUID | None = None
    reportado_por: uuid.UUID | None = None
    titulo: str | None = None
    descripcion: str | None = None
    prioridad: TicketPriority | None = None
    estado: TicketStatus | None = None
    asignado_a: str | None = None
    costo_estimado: Decimal | None = None
    costo_real: Decimal | None = None
    fecha_apertura: date | None = None
    fecha_cierre: date | None = None


class TicketMantenimientoRead(TicketMantenimientoBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
