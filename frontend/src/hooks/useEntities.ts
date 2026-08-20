import { useQuery } from "@tanstack/react-query";
import { propiedadesApi } from "@/api/propiedades";
import { inquilinosApi } from "@/api/inquilinos";
import { contratosApi } from "@/api/contratos";
import { pagosApi } from "@/api/pagos";
import { ticketsApi } from "@/api/tickets";

export const qk = {
  propiedades: ["propiedades"] as const,
  inquilinos: ["inquilinos"] as const,
  contratos: ["contratos"] as const,
  pagos: ["pagos"] as const,
  tickets: ["tickets"] as const,
};

export function usePropiedades() {
  return useQuery({ queryKey: qk.propiedades, queryFn: propiedadesApi.list });
}

export function useInquilinos() {
  return useQuery({ queryKey: qk.inquilinos, queryFn: inquilinosApi.list });
}

export function useContratos() {
  return useQuery({ queryKey: qk.contratos, queryFn: () => contratosApi.list() });
}

export function usePagos() {
  return useQuery({ queryKey: qk.pagos, queryFn: () => pagosApi.list() });
}

export function useTickets() {
  return useQuery({ queryKey: qk.tickets, queryFn: () => ticketsApi.list() });
}
