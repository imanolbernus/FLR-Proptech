import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/common/QueryStates";
import { ticketsApi } from "@/api/tickets";
import { ApiError } from "@/api/client";
import { qk } from "@/hooks/useEntities";
import { TicketPriority } from "@/types/enums";
import type { Propiedad, TicketMantenimientoCreate } from "@/types/entities";
import { ticketPriorityLabels } from "@/utils/labels";

export function TicketFormModal({
  propiedades,
  onClose,
}: {
  propiedades: Propiedad[];
  onClose: () => void;
}) {
  const [form, setForm] = useState<TicketMantenimientoCreate>({
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
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => ticketsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.tickets });
      onClose();
    },
  });

  return (
    <Modal title="Nuevo ticket de mantenimiento" onClose={onClose}>
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending || !form.propiedad_id}>
            {mutation.isPending ? "Guardando…" : "Crear ticket"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
