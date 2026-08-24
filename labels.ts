// Etiquetas en español + color de estatus para cada enum, usando SOLO los
// 4 roles fijos de la paleta de dataviz (good/warning/serious/critical) —
// nunca colores "de serie" para estado.
import type {
  ContractStatus,
  PaymentStatus,
  PropertyStatus,
  PropertyType,
  TenantType,
  TicketPriority,
  TicketStatus,
} from "@/types/enums";

type StatusRole = "good" | "warning" | "serious" | "critical" | "neutral";

export const propertyTypeLabels: Record<PropertyType, string> = {
  bodega: "Bodega",
  oficina: "Oficina",
  bodega_oficina: "Bodega y oficinas",
  local_comercial: "Local comercial",
  nave_industrial: "Nave industrial",
  terreno: "Terreno",
  departamento: "Departamento",
  casa: "Casa",
  otro: "Otro",
};

export const propertyStatusLabels: Record<PropertyStatus, string> = {
  disponible: "Disponible",
  ocupada: "Ocupada",
  en_mantenimiento: "En mantenimiento",
  inactiva: "Inactiva",
};
export const propertyStatusRole: Record<PropertyStatus, StatusRole> = {
  disponible: "good",
  ocupada: "neutral",
  en_mantenimiento: "warning",
  inactiva: "critical",
};

export const tenantTypeLabels: Record<TenantType, string> = {
  persona_fisica: "Persona física",
  persona_moral: "Persona moral",
};

export const contractStatusLabels: Record<ContractStatus, string> = {
  borrador: "Borrador",
  activo: "Activo",
  vencido: "Vencido / en prórroga",
  renovado: "Renovado",
  terminado_anticipadamente: "Terminado anticipadamente",
};
export const contractStatusRole: Record<ContractStatus, StatusRole> = {
  borrador: "neutral",
  activo: "good",
  vencido: "warning",
  renovado: "good",
  terminado_anticipadamente: "critical",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  atrasado: "Atrasado",
  pago_parcial: "Pago parcial",
  cancelado: "Cancelado",
};
export const paymentStatusRole: Record<PaymentStatus, StatusRole> = {
  pendiente: "neutral",
  pagado: "good",
  atrasado: "critical",
  pago_parcial: "warning",
  cancelado: "neutral",
};

export const ticketPriorityLabels: Record<TicketPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  urgente: "Urgente",
};
export const ticketPriorityRole: Record<TicketPriority, StatusRole> = {
  baja: "neutral",
  media: "warning",
  alta: "serious",
  urgente: "critical",
};

export const ticketStatusLabels: Record<TicketStatus, string> = {
  abierto: "Abierto",
  en_proceso: "En proceso",
  resuelto: "Resuelto",
  cancelado: "Cancelado",
};
export const ticketStatusRole: Record<TicketStatus, StatusRole> = {
  abierto: "critical",
  en_proceso: "warning",
  resuelto: "good",
  cancelado: "neutral",
};

export const statusRoleClasses: Record<StatusRole, string> = {
  good: "bg-status-good/10 text-status-good ring-1 ring-status-good/30",
  warning: "bg-status-warning/15 text-[#8a5a00] ring-1 ring-status-warning/40",
  serious: "bg-status-serious/15 text-[#a33f1c] ring-1 ring-status-serious/40",
  critical: "bg-status-critical/10 text-status-critical ring-1 ring-status-critical/30",
  neutral: "bg-ink-muted/10 text-ink-secondary ring-1 ring-ink-muted/30",
};
