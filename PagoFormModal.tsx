import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/common/QueryStates";
import { pagosApi } from "@/api/pagos";
import { ApiError } from "@/api/client";
import { qk } from "@/hooks/useEntities";
import { PaymentMethod, PaymentStatus } from "@/types/enums";
import type { Contrato, Pago, PagoCreate, Propiedad } from "@/types/entities";
import { paymentStatusLabels } from "@/utils/labels";

function toForm(p: Pago): PagoCreate {
  const { id: _id, created_at: _c, updated_at: _u, ...rest } = p;
  return rest;
}

export function PagoFormModal({
  contratos,
  propiedades,
  pago,
  onClose,
}: {
  contratos: Contrato[];
  propiedades: Propiedad[];
  pago?: Pago | null;
  onClose: () => void;
}) {
  const isEdit = !!pago;
  const [form, setForm] = useState<PagoCreate>(
    pago
      ? toForm(pago)
      : {
          contrato_id: contratos[0]?.id ?? "",
          monto: "",
          fecha_vencimiento: new Date().toISOString().slice(0, 10),
          fecha_pago: null,
          estado: PaymentStatus.pendiente,
          metodo_pago: null,
          comprobante_url: null,
          notas: null,
        }
  );
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => (isEdit ? pagosApi.update(pago!.id, form) : pagosApi.create(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.pagos });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => pagosApi.remove(pago!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.pagos });
      onClose();
    },
  });

  const contratoLabel = (c: Contrato) => {
    const p = propiedades.find((prop) => prop.id === c.propiedad_id);
    return `${p?.nombre_referencia ?? "Inmueble"} — ${c.fecha_inicio.slice(0, 4)}`;
  };

  return (
    <Modal title={isEdit ? "Editar pago" : "Registrar pago"} onClose={onClose}>
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
                  : "No se pudo registrar el pago."
              }
            />
          </div>
        )}

        <Field label="Contrato">
          <Select
            required
            value={form.contrato_id}
            onChange={(e) => setForm({ ...form, contrato_id: e.target.value })}
          >
            {contratos.map((c) => (
              <option key={c.id} value={c.id}>
                {contratoLabel(c)}
              </option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Monto (MXN)">
            <Input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
            />
          </Field>
          <Field label="Fecha de vencimiento">
            <Input
              required
              type="date"
              value={form.fecha_vencimiento}
              onChange={(e) => setForm({ ...form, fecha_vencimiento: e.target.value })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Estado">
            <Select
              value={form.estado}
              onChange={(e) => {
                const estado = e.target.value as PaymentStatus;
                setForm({
                  ...form,
                  estado,
                  fecha_pago:
                    estado === PaymentStatus.pagado
                      ? (form.fecha_pago ?? new Date().toISOString().slice(0, 10))
                      : form.fecha_pago,
                });
              }}
            >
              {Object.values(PaymentStatus).map((s) => (
                <option key={s} value={s}>
                  {paymentStatusLabels[s]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Fecha de pago">
            <Input
              type="date"
              value={form.fecha_pago ?? ""}
              onChange={(e) => setForm({ ...form, fecha_pago: e.target.value || null })}
              required={form.estado === PaymentStatus.pagado}
            />
          </Field>
        </div>

        <Field label="Método de pago (opcional)">
          <Select
            value={form.metodo_pago ?? ""}
            onChange={(e) =>
              setForm({ ...form, metodo_pago: (e.target.value || null) as PaymentMethod | null })
            }
          >
            <option value="">—</option>
            {Object.values(PaymentMethod).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex items-center justify-between gap-2">
          <div>
            {isEdit && (
              <Button
                type="button"
                variant="danger"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (confirm("¿Eliminar este pago?")) {
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
            <Button type="submit" disabled={mutation.isPending || !form.contrato_id}>
              {mutation.isPending ? "Guardando…" : isEdit ? "Guardar cambios" : "Registrar pago"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
