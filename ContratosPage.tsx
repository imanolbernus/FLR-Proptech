import { apiClient } from "./client";
import type { Propiedad, PropiedadCreate } from "@/types/entities";

export const propiedadesApi = {
  list: () => apiClient.get<Propiedad[]>("/propiedades/?limit=100"),
  get: (id: string) => apiClient.get<Propiedad>(`/propiedades/${id}`),
  create: (data: PropiedadCreate) => apiClient.post<Propiedad>("/propiedades/", data),
  update: (id: string, data: Partial<PropiedadCreate>) =>
    apiClient.patch<Propiedad>(`/propiedades/${id}`, data),
  remove: (id: string) => apiClient.delete(`/propiedades/${id}`),
};
