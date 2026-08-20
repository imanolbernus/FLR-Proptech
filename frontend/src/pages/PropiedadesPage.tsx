import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/QueryStates";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { usePropiedades } from "@/hooks/useEntities";
import { PropiedadFormModal } from "@/features/propiedades/PropiedadFormModal";
import { formatAddress, formatCurrency } from "@/utils/format";
import { propertyStatusLabels, propertyStatusRole, propertyTypeLabels } from "@/utils/labels";

export function PropiedadesPage() {
  const { data, isLoading, error } = usePropiedades();
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <PageHeader
        title="Propiedades"
        description="Inventario de inmuebles del portafolio."
        actions={<Button onClick={() => setShowForm(true)}>+ Nueva propiedad</Button>}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState message="No se pudieron cargar las propiedades." />}

      {data && data.length === 0 && (
        <EmptyState title="Sin propiedades registradas" description="Crea la primera propiedad." />
      )}

      {data && data.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Inmueble</th>
                <th className="px-4 py-3 font-medium">Dirección</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Renta base</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gridline">
              {data.map((p) => (
                <tr key={p.id} className="hover:bg-page/60">
                  <td className="px-4 py-3 font-medium text-ink-primary">{p.nombre_referencia}</td>
                  <td className="px-4 py-3 text-ink-secondary">{formatAddress(p)}</td>
                  <td className="px-4 py-3 text-ink-secondary">{propertyTypeLabels[p.tipo]}</td>
                  <td className="px-4 py-3">
                    <Badge role={propertyStatusRole[p.estado_ocupacion]}>
                      {propertyStatusLabels[p.estado_ocupacion]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-primary">
                    {formatCurrency(p.renta_base)}
                    {p.renta_incluye_iva && (
                      <span className="ml-1 text-xs text-ink-muted">+IVA</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {showForm && <PropiedadFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}
