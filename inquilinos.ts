// Espejo de app/schemas/enums.py del backend. Mantener en sincronía manual.

export const UserRole = {
  admin: "admin",
  property_manager: "property_manager",
  viewer: "viewer",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PropertyType = {
  bodega: "bodega",
  oficina: "oficina",
  bodega_oficina: "bodega_oficina",
  local_comercial: "local_comercial",
  nave_industrial: "nave_industrial",
  terreno: "terreno",
  departamento: "departamento",
  casa: "casa",
  otro: "otro",
} as const;
export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType];

export const PropertyStatus = {
  disponible: "disponible",
  ocupada: "ocupada",
  en_mantenimiento: "en_mantenimiento",
  inactiva: "inactiva",
} as const;
export type PropertyStatus = (typeof PropertyStatus)[keyof typeof PropertyStatus];

export const TenantType = {
  persona_fisica: "persona_fisica",
  persona_moral: "persona_moral",
} as const;
export type TenantType = (typeof TenantType)[keyof typeof TenantType];

export const ContractStatus = {
  borrador: "borrador",
  activo: "activo",
  vencido: "vencido",
  renovado: "renovado",
  terminado_anticipadamente: "terminado_anticipadamente",
} as const;
export type ContractStatus = (typeof ContractStatus)[keyof typeof ContractStatus];

export const PaymentStatus = {
  pendiente: "pendiente",
  pagado: "pagado",
  atrasado: "atrasado",
  pago_parcial: "pago_parcial",
  cancelado: "cancelado",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  transferencia: "transferencia",
  efectivo: "efectivo",
  cheque: "cheque",
  deposito_bancario: "deposito_bancario",
  tarjeta: "tarjeta",
  otro: "otro",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const TicketPriority = {
  baja: "baja",
  media: "media",
  alta: "alta",
  urgente: "urgente",
} as const;
export type TicketPriority = (typeof TicketPriority)[keyof typeof TicketPriority];

export const TicketStatus = {
  abierto: "abierto",
  en_proceso: "en_proceso",
  resuelto: "resuelto",
  cancelado: "cancelado",
} as const;
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];
