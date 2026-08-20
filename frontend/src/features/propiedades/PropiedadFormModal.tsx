import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/common/QueryStates";
import { propiedadesApi } from "@/api/propiedades";
import { ApiError } from "@/api/client";
import { qk } from "@/hooks/useEntities";
import { PropertyStatus, PropertyType } from "@/types/enums";
import type { PropiedadCreate } from "@/types/entities";
import { propertyStatusLabels, propertyTypeLabels } from "@/utils/labels";

const emptyForm: PropiedadCreate = {
  usuario_id: null,
  nombre_referencia: "",
  calle: "",
  numero_exterior: "",
  numero_interior: "",
  colonia: "",
  ciudad: "Ciudad de México",
  estado_republica: "Ciudad de México",
  codigo_postal: "",
  pais: "México",
  tipo: PropertyType.bodega,
  estado_ocupacion: PropertyStatus.disponible,
  superficie_m2: null,
  renta_base: "",
  renta_incluye_iva: true,
  notas: "",
};

export function PropiedadFormModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<PropiedadCreate>(emptyForm);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      propiedadesApi.create({
        ...form,
        numero_exterior: form.numero_exterior || null,
        numero_interior: form.numero_interior || null,
        colonia: form.colonia || null,
        codigo_postal: form.codigo_postal || null,
        notas: form.notas || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.propiedades });
      onClose();
    },
  });

  return (
    <Modal title="Nueva propiedad" onClose={onClose}>
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
                  : "No se pudo crear la propiedad."
              }
            />
          </div>
        )}

        <Field label="Nombre de referencia">
          <Input
            required
            value={form.nombre_referencia}
            onChange={(e) => setForm({ ...form, nombre_referencia: e.target.value })}
            placeholder="Ej. Cuitláhuac 88-C"
          />
        </Field>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <Field label="Calle">
              <Input
                required
                value={form.calle}
                onChange={(e) => setForm({ ...form, calle: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Número">
            <Input
              value={form.numero_exterior ?? ""}
              onChange={(e) => setForm({ ...form, numero_exterior: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Colonia">
          <Input
            value={form.colonia ?? ""}
            onChange={(e) => setForm({ ...form, colonia: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Tipo de inmueble">
            <Select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as PropertyType })}
            >
              {Object.values(PropertyType).map((t) => (
                <option key={t} value={t}>
                  {propertyTypeLabels[t]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estado de ocupación">
            <Select
              value={form.estado_ocupacion}
              onChange={(e) =>
                setForm({ ...form, estado_ocupacion: e.target.value as PropertyStatus })
              }
            >
              {Object.values(PropertyStatus).map((s) => (
                <option key={s} value={s}>
                  {propertyStatusLabels[s]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Renta base mensual (MXN)">
          <Input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.renta_base}
            onChange={(e) => setForm({ ...form, renta_base: e.target.value })}
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

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Guardando…" : "Guardar propiedad"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
