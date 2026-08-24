import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/common/QueryStates";
import { contratosApi } from "@/api/contratos";
import { ApiError } from "@/api/client";
import { qk } from "@/hooks/useEntities";
import { ContractStatus } from "@/types/enums";
import type { Contrato, ContratoCreate, Inquilino, Propiedad } from "@/types/entities";
import { contractStatusLabels } from "@/utils/labels";

function toForm(c: Contrato): ContratoCreate {
  const { id: _id, created_at: _c, updated_at: _u, ...rest } = c;
  return rest;
}

export function ContratoFormModal({
  propiedades,
  inquilinos,
  contrato,
  onClose,
}: {
  propiedades: Propiedad[];
  inquilinos: Inquilino[];
  contrato?: Contrato | null;
  onClose: () => void;
}) {
  const isEdit = !!contrato;
  const [form, setForm] = useState<ContratoCreate>(
    contrato
      ? toForm(contrato)
      : {
          propiedad_id: propiedades[0]?.id ?? "",
          inquilino_id: inquilinos[0]?.id ?? "",
          fecha_inicio: new Date().toISOString().slice(0, 10),
          fecha_fin: new Date().toISOString().slice(0, 10),
          renta_mensual: "",
          renta_incluye_iva: true,
          deposito_garantia: "0",
          penalizacion_mora_diaria: "0",
          ajuste_indexado_inpc: true,
          margen_ajuste_pp: null,
          uso_permitido: "",
          jurisdiccion: "",
          estado: ContractStatus.activo,
          archivo_url: null,
          notas: "",
        }
  );
  const queryClient = useQueryClient();

  const payload = () => ({
    ...form,
    margen_ajuste_pp: form.margen_ajuste_pp || null,
    uso_permitido: form.uso_permitido || null,
    jurisdiccion: form.jurisdiccion || null,
    notas: form.notas || null,
  });

  const mutation = useMutation({
    mutationFn: () =>
      isEdit ? contratosApi.update(contrato!.id, payload()) : contratosApi.create(payload()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.contratos });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => contratosApi.remove(contrato!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.contratos });
      onClose();
    },
  });

  return (
    <Modal title={isEdit ? "Editar contrato" : "Nuevo contrato"} onClose={onClose}>
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
                  : "No se pudo guardar el contrato."
              }
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
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
          <Field label="Inquilino">
            <Select
              required
              value={form.inquilino_id}
              onChange={(e) => setForm({ ...form, inquilino_id: e.target.value })}
            >
              {inquilinos.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nombre_razon_social}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Fecha inicio">
            <Input
              required
              type="date"
              value={form.fecha_inicio}
              onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
            />
          </Field>
          <Field label="Fecha fin">
            <Input
              required
              type="date"
              value={form.fecha_fin}
              onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Renta mensual (MXN)">
            <Input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.renta_mensual}
              onChange={(e) => setForm({ ...form, renta_mensual: e.target.value })}
            />
          </Field>
          <Field label="Depósito en garantía">
            <Input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.deposito_garantia}
              onChange={(e) => setForm({ ...form, deposito_garantia: e.target.value })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Penalización por mora (diaria)">
            <Input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.penalizacion_mora_diaria}
              onChange={(e) => setForm({ ...form, penalizacion_mora_diaria: e.target.value })}
            />
          </Field>
          <Field label="Estado del contrato">
            <Select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value as ContractStatus })}
            >
              {Object.values(ContractStatus).map((s) => (
                <option key={s} value={s}>
                  {contractStatusLabels[s]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Uso permitido (opcional)">
          <Input
            value={form.uso_permitido ?? ""}
            onChange={(e) => setForm({ ...form, uso_permitido: e.target.value })}
          />
        </Field>

        <label className="mb-4 flex items-center gap-2 text-sm text-ink-secondary">
          <input
            type="checkbox"
            checked={form.renta_incluye_iva}
            onChange={(e) => setForm({ ...form, renta_incluye_iva: e.target.checked })}
          />
          La renta incluye IVA
        </label>

        <div className="flex items-center justify-between gap-2">
          <div>
            {isEdit && (
              <Button
                type="button"
                variant="danger"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (confirm("¿Eliminar este contrato?")) {
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
            <Button
              type="submit"
              disabled={mutation.isPending || !form.propiedad_id || !form.inquilino_id}
            >
              {mutation.isPending ? "Guardando…" : isEdit ? "Guardar cambios" : "Guardar contrato"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
