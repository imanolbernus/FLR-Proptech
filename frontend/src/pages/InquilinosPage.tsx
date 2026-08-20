import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/QueryStates";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useInquilinos } from "@/hooks/useEntities";
import { InquilinoFormModal } from "@/features/inquilinos/InquilinoFormModal";
import { tenantTypeLabels } from "@/utils/labels";
import type { Inquilino } from "@/types/entities";

export function InquilinosPage() {
  const { data, isLoading, error } = useInquilinos();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Inquilino | null>(null);

  return (
    <div>
      <PageHeader
        title="Inquilinos"
        description="Personas físicas y morales que rentan los inmuebles."
        actions={<Button onClick={() => setShowForm(true)}>+ Nuevo inquilino</Button>}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState message="No se pudieron cargar los inquilinos." />}

      {data && data.length === 0 && (
        <EmptyState title="Sin inquilinos registrados" description="Crea el primer inquilino." />
      )}

      {data && data.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre / Razón social</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">RFC</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gridline">
              {data.map((i) => (
                <tr
                  key={i.id}
                  className="cursor-pointer hover:bg-page/60"
                  onClick={() => setEditing(i)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-primary">{i.nombre_razon_social}</p>
                    {i.representante_legal && (
                      <p className="text-xs text-ink-muted">Repr.: {i.representante_legal}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{tenantTypeLabels[i.tipo_persona]}</td>
                  <td className="px-4 py-3 text-ink-secondary">{i.rfc ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-secondary">
                    {i.email || i.telefono ? (
                      <>
                        {i.email && <p>{i.email}</p>}
                        {i.telefono && <p>{i.telefono}</p>}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {showForm && <InquilinoFormModal onClose={() => setShowForm(false)} />}
      {editing && <InquilinoFormModal inquilino={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
