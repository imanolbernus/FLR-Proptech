import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/common/QueryStates";
import { ticketsApi } from "@/api/tickets";
import { ApiError } from "@/api/client";
import { qk } from "@/hooks/useEntities";
import { TicketPriority, TicketStatus } from "@/types/enums";
import type { Propiedad, TicketMantenimiento, TicketMantenimientoCreate } from "@/types/entities";
import { ticketPriorityLabels, ticketStatusLabels } from "@/utils/labels";

function toForm(t: TicketMantenimiento): TicketMantenimientoCreate {
  const { id: _id, created_at: _c, updated_at: _u, ...rest } = t;
  return rest;
}

export function TicketFormModal({
  propiedades,
  ticket,
  onClose,
}: {
  propiedades: Propiedad[];
  ticket?: TicketMantenimiento | null;
  onClose: () => void;
}) {
  const isEdit = !!ticket;
  const [form, setForm] = useState<TicketMantenimientoCreate>(
    ticket
      ? toForm(ticket)
      : {
          propiedad_id: propiedades[0]?.id ?? "",
          contrato_id: null,
          reportado_por: null,
          titulo: "",
          descripcion: "",
          prioridad: TicketPriority.media,
          estado: "abierto",
          asignado_a: null,
          costo_estimado: null,
          costo_real: null,
          fecha_apertura: new Date().toISOString().slice(0, 10),
          fecha_cierre: null,
        }
  );
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => (isEdit ? ticketsApi.update(ticket!.id, form) : ticketsApi.create(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.tickets });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => ticketsApi.remove(ticket!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.tickets });
      onClose();
    },
  });

  return (
    <Modal title={isEdit ? "Editar ticket de mantenimiento" : "Nuevo ticket de mantenimiento"} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        {mutation.isError && (
          <div className="mb-3">
            <ErrorState
              message={
                mutation.error instanceof ApiError
                  ? JSON.stringify(mutation.error.detail)
                  : "No se pudo crear el ticket."
              }
            />
          </div>
        )}

        <Field label="Inmueble">
          <Select
            required
            value={form.propiedad_id}
            onChange={(e) => setForm({ ...form, propiedad_id: e.target.value })}
          >
            {propiedades.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre_referencia}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Título">
          <Input
            required
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </Field>

        <Field label="Descripción">
          <textarea
            required
            className="w-full rounded-lg border-0 bg-page px-3 py-2 text-sm text-ink-primary ring-1 ring-inset ring-border focus:ring-2 focus:ring-brand-450 focus:outline-none"
            rows={3}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Prioridad">
            <Select
              value={form.prioridad}
              onChange={(e) => setForm({ ...form, prioridad: e.target.value as TicketPriority })}
            >
              {Object.values(TicketPriority).map((p) => (
                <option key={p} value={p}>
                  {ticketPriorityLabels[p]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estado">
            <Select
              value={form.estado}
              onChange={(e) => {
                const estado = e.target.value as TicketStatus;
                setForm({
                  ...form,
                  estado,
                  fecha_cierre:
                    estado === TicketStatus.resuelto || estado === TicketStatus.cancelado
                      ? (form.fecha_cierre ?? new Date().toISOString().slice(0, 10))
                      : form.fecha_cierre,
                });
              }}
            >
              {Object.values(TicketStatus).map((s) => (
                <option key={s} value={s}>
                  {ticketStatusLabels[s]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            {isEdit && (
              <Button
                type="button"
                variant="danger"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (confirm(`¿Eliminar el ticket "${ticket!.titulo}"?`)) {
                    deleteMutation.mutate();
                  }
                }}
              >
                {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending || !form.propiedad_id}>
              {mutation.isPending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear ticket"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
