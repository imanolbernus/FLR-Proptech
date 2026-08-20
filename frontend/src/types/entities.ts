// Espejo de app/schemas/*.py del backend.
// Nota: los campos NUMERIC/Decimal del backend se serializan como string en
// JSON (comportamiento por defecto de Pydantic v2), por eso aquí son `string`
// y se convierten con Number(...) al mostrarlos o graficarlos.
import type {
  ContractStatus,
  PaymentMethod,
  PaymentStatus,
  PropertyStatus,
  PropertyType,
  TenantType,
  TicketPriority,
  TicketStatus,
  UserRole,
} from "./enums";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  telefono: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Propiedad {
  id: string;
  usuario_id: string | null;
  nombre_referencia: string;
  calle: string;
  numero_exterior: string | null;
  numero_interior: string | null;
  colonia: string | null;
  ciudad: string;
  estado_republica: string;
  codigo_postal: string | null;
  pais: string;
  tipo: PropertyType;
  estado_ocupacion: PropertyStatus;
  superficie_m2: string | null;
  renta_base: string;
  renta_incluye_iva: boolean;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export type PropiedadCreate = Omit<Propiedad, "id" | "created_at" | "updated_at">;

export interface Inquilino {
  id: string;
  tipo_persona: TenantType;
  nombre_razon_social: string;
  rfc: string | null;
  representante_legal: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export type InquilinoCreate = Omit<Inquilino, "id" | "created_at" | "updated_at">;

export interface Contrato {
  id: string;
  propiedad_id: string;
  inquilino_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  renta_mensual: string;
  renta_incluye_iva: boolean;
  deposito_garantia: string;
  penalizacion_mora_diaria: string;
  ajuste_indexado_inpc: boolean;
  margen_ajuste_pp: string | null;
  uso_permitido: string | null;
  jurisdiccion: string | null;
  estado: ContractStatus;
  archivo_url: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export type ContratoCreate = Omit<Contrato, "id" | "created_at" | "updated_at">;

export interface Pago {
  id: string;
  contrato_id: string;
  monto: string;
  fecha_vencimiento: string;
  fecha_pago: string | null;
  estado: PaymentStatus;
  metodo_pago: PaymentMethod | null;
  comprobante_url: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export type PagoCreate = Omit<Pago, "id" | "created_at" | "updated_at">;

export interface TicketMantenimiento {
  id: string;
  propiedad_id: string;
  contrato_id: string | null;
  reportado_por: string | null;
  titulo: string;
  descripcion: string;
  prioridad: TicketPriority;
  estado: TicketStatus;
  asignado_a: string | null;
  costo_estimado: string | null;
  costo_real: string | null;
  fecha_apertura: string;
  fecha_cierre: string | null;
  created_at: string;
  updated_at: string;
}

export type TicketMantenimientoCreate = Omit<
  TicketMantenimiento,
  "id" | "created_at" | "updated_at"
>;
