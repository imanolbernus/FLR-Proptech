import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, model_validator

from app.schemas.enums import PaymentMethod, PaymentStatus


class PagoBase(BaseModel):
    contrato_id: uuid.UUID
    monto: Decimal
    fecha_vencimiento: date
    fecha_pago: date | None = None
    estado: PaymentStatus = PaymentStatus.pendiente
    metodo_pago: PaymentMethod | None = None
    comprobante_url: str | None = None
    notas: str | None = None

    @model_validator(mode="after")
    def validar_pago(self) -> "PagoBase":
        if self.estado == PaymentStatus.pagado and self.fecha_pago is None:
            raise ValueError("fecha_pago es obligatoria cuando estado='pagado'")
        return self


class PagoCreate(PagoBase):
    pass


class PagoUpdate(BaseModel):
    contrato_id: uuid.UUID | None = None
    monto: Decimal | None = None
    fecha_vencimiento: date | None = None
    fecha_pago: date | None = None
    estado: PaymentStatus | None = None
    metodo_pago: PaymentMethod | None = None
    comprobante_url: str | None = None
    notas: str | None = None


class PagoRead(PagoBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
