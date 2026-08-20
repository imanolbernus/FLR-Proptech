"""Enums Python que reflejan los tipos ENUM de PostgreSQL definidos en
app/db/schema.sql. Deben mantenerse en sincronía manualmente."""
from enum import Enum


class UserRole(str, Enum):
    admin = "admin"
    property_manager = "property_manager"
    viewer = "viewer"


class PropertyType(str, Enum):
    bodega = "bodega"
    oficina = "oficina"
    bodega_oficina = "bodega_oficina"
    local_comercial = "local_comercial"
    nave_industrial = "nave_industrial"
    terreno = "terreno"
    departamento = "departamento"
    casa = "casa"
    otro = "otro"


class PropertyStatus(str, Enum):
    disponible = "disponible"
    ocupada = "ocupada"
    en_mantenimiento = "en_mantenimiento"
    inactiva = "inactiva"


class TenantType(str, Enum):
    persona_fisica = "persona_fisica"
    persona_moral = "persona_moral"


class ContractStatus(str, Enum):
    borrador = "borrador"
    activo = "activo"
    vencido = "vencido"
    renovado = "renovado"
    terminado_anticipadamente = "terminado_anticipadamente"


class PaymentStatus(str, Enum):
    pendiente = "pendiente"
    pagado = "pagado"
    atrasado = "atrasado"
    pago_parcial = "pago_parcial"
    cancelado = "cancelado"


class PaymentMethod(str, Enum):
    transferencia = "transferencia"
    efectivo = "efectivo"
    cheque = "cheque"
    deposito_bancario = "deposito_bancario"
    tarjeta = "tarjeta"
    otro = "otro"


class TicketPriority(str, Enum):
    baja = "baja"
    media = "media"
    alta = "alta"
    urgente = "urgente"


class TicketStatus(str, Enum):
    abierto = "abierto"
    en_proceso = "en_proceso"
    resuelto = "resuelto"
    cancelado = "cancelado"
