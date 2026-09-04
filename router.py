import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, model_validator

from app.schemas.enums import ContractStatus


class ContratoBase(BaseModel):
    propiedad_id: uuid.UUID
    inquilino_id: uuid.UUID
    fecha_inicio: date
    fecha_fin: date
    renta_mensual: Decimal
    renta_incluye_iva: bool = True
    deposito_garantia: Decimal = Decimal("0")
    penalizacion_mora_diaria: Decimal = Decimal("0")
    ajuste_indexado_inpc: bool = True
    margen_ajuste_pp: Decimal | None = None
    uso_permitido: str | None = None
    jurisdiccion: str | None = None
    estado: ContractStatus = ContractStatus.activo
    archivo_url: str | None = None
    notas: str | None = None

    @model_validator(mode="after")
    def validar_fechas(self) -> "ContratoBase":
        if self.fecha_fin <= self.fecha_inicio:
            raise ValueError("fecha_fin debe ser posterior a fecha_inicio")
        return self


class ContratoCreate(ContratoBase):
    pass


class ContratoUpdate(BaseModel):
    propiedad_id: uuid.UUID | None = None
    inquilino_id: uuid.UUID | None = None
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    renta_mensual: Decimal | None = None
    renta_incluye_iva: bool | None = None
    deposito_garantia: Decimal | None = None
    penalizacion_mora_diaria: Decimal | None = None
    ajuste_indexado_inpc: bool | None = None
    margen_ajuste_pp: Decimal | None = None
    uso_permitido: str | None = None
    jurisdiccion: str | None = None
    estado: ContractStatus | None = None
    archivo_url: str | None = None
    notas: str | None = None


class ContratoRead(ContratoBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
