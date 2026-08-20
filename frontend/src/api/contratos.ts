import { apiClient } from "./client";
import type { Contrato, ContratoCreate } from "@/types/entities";

export const contratosApi = {
  list: (propiedadId?: string) =>
    apiClient.get<Contrato[]>(
      `/contratos/?limit=100${propiedadId ? `&propiedad_id=${propiedadId}` : ""}`
    ),
  get: (id: string) => apiClient.get<Contrato>(`/contratos/${id}`),
  create: (data: ContratoCreate) => apiClient.post<Contrato>("/contratos/", data),
  update: (id: string, data: Partial<ContratoCreate>) =>
    apiClient.patch<Contrato>(`/contratos/${id}`, data),
  remove: (id: string) => apiClient.delete(`/contratos/${id}`),
};
