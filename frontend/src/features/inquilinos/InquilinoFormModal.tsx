import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/common/QueryStates";
import { inquilinosApi } from "@/api/inquilinos";
import { ApiError } from "@/api/client";
import { qk } from "@/hooks/useEntities";
import { TenantType } from "@/types/enums";
import type { InquilinoCreate } from "@/types/entities";
import { tenantTypeLabels } from "@/utils/labels";

const emptyForm: InquilinoCreate = {
  tipo_persona: TenantType.persona_fisica,
  nombre_razon_social: "",
  rfc: "",
  representante_legal: "",
  email: "",
  telefono: "",
  direccion: "",
  notas: "",
};

export function InquilinoFormModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<InquilinoCreate>(emptyForm);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      inquilinosApi.create({
        ...form,
        rfc: form.rfc || null,
        representante_legal: form.representante_legal || null,
        email: form.email || null,
        telefono: form.telefono || null,
        direccion: form.direccion || null,
        notas: form.notas || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.inquilinos });
      onClose();
    },
  });

  return (
    <Modal title="Nuevo inquilino" onClose={onClose}>
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
                  : "No se pudo crear el inquilino."
              }
            />
          </div>
        )}

        <Field label="Tipo de persona">
          <Select
            value={form.tipo_persona}
            onChange={(e) => setForm({ ...form, tipo_persona: e.target.value as TenantType })}
          >
            {Object.values(TenantType).map((t) => (
              <option key={t} value={t}>
                {tenantTypeLabels[t]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label={form.tipo_persona === "persona_moral" ? "Razón social" : "Nombre completo"}>
          <Input
            required
            value={form.nombre_razon_social}
            onChange={(e) => setForm({ ...form, nombre_razon_social: e.target.value })}
          />
        </Field>

        {form.tipo_persona === "persona_moral" && (
          <Field label="Representante legal">
            <Input
              value={form.representante_legal ?? ""}
              onChange={(e) => setForm({ ...form, representante_legal: e.target.value })}
            />
          </Field>
        )}

        <Field label="RFC (opcional)">
          <Input value={form.rfc ?? ""} onChange={(e) => setForm({ ...form, rfc: e.target.value })} />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Email">
            <Input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Teléfono">
            <Input
              value={form.telefono ?? ""}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Guardando…" : "Guardar inquilino"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
