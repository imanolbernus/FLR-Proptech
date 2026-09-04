import { apiClient } from "./client";
import type { Pago, PagoCreate } from "@/types/entities";

export const pagosApi = {
  list: (contratoId?: string) =>
    apiClient.get<Pago[]>(`/pagos/?limit=100${contratoId ? `&contrato_id=${contratoId}` : ""}`),
  get: (id: string) => apiClient.get<Pago>(`/pagos/${id}`),
  create: (data: PagoCreate) => apiClient.post<Pago>("/pagos/", data),
  update: (id: string, data: Partial<PagoCreate>) => apiClient.patch<Pago>(`/pagos/${id}`, data),
  remove: (id: string) => apiClient.delete(`/pagos/${id}`),
};
