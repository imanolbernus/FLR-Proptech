import { apiClient } from "./client";
import type { Inquilino, InquilinoCreate } from "@/types/entities";

export const inquilinosApi = {
  list: () => apiClient.get<Inquilino[]>("/inquilinos/?limit=100"),
  get: (id: string) => apiClient.get<Inquilino>(`/inquilinos/${id}`),
  create: (data: InquilinoCreate) => apiClient.post<Inquilino>("/inquilinos/", data),
  update: (id: string, data: Partial<InquilinoCreate>) =>
    apiClient.patch<Inquilino>(`/inquilinos/${id}`, data),
  remove: (id: string) => apiClient.delete(`/inquilinos/${id}`),
};
