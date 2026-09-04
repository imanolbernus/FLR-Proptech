import { apiClient } from "./client";
import type { TicketMantenimiento, TicketMantenimientoCreate } from "@/types/entities";

export const ticketsApi = {
  list: (propiedadId?: string) =>
    apiClient.get<TicketMantenimiento[]>(
      `/tickets/?limit=100${propiedadId ? `&propiedad_id=${propiedadId}` : ""}`
    ),
  get: (id: string) => apiClient.get<TicketMantenimiento>(`/tickets/${id}`),
  create: (data: TicketMantenimientoCreate) =>
    apiClient.post<TicketMantenimiento>("/tickets/", data),
  update: (id: string, data: Partial<TicketMantenimientoCreate>) =>
    apiClient.patch<TicketMantenimiento>(`/tickets/${id}`, data),
  remove: (id: string) => apiClient.delete(`/tickets/${id}`),
};
