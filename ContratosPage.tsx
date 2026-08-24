import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/QueryStates";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useContratos, useInquilinos, usePropiedades } from "@/hooks/useEntities";
import { ContratoFormModal } from "@/features/contratos/ContratoFormModal";
import { formatCurrency, formatDate } from "@/utils/format";
import { contractStatusLabels, contractStatusRole } from "@/utils/labels";
import type { Contrato } from "@/types/entities";

export function ContratosPage() {
  const contratos = useContratos();
  const propiedades = usePropiedades();
  const inquilinos = useInquilinos();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contrato | null>(null);

  const isLoading = contratos.isLoading || propiedades.isLoading || inquilinos.isLoading;
  const error = contratos.error || propiedades.error || inquilinos.error;
  const hayDatosBase = (propiedades.data ?? []).length > 0 && (inquilinos.data ?? []).length > 0;

  return (
    <div>
      <PageHeader
        title="Contratos"
        description="Historial de arrendamiento por inmueble. Un solo contrato puede estar 'activo' por inmueble a la vez."
        actions={
          <Button onClick={() => setShowForm(true)} disabled={!hayDatosBase}>
            + Nuevo contrato
          </Button>
        }
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState message="No se pudieron cargar los contratos." />}

      {contratos.data && contratos.data.length === 0 && (
        <EmptyState title="Sin contratos registrados" />
      )}

      {contratos.data && contratos.data.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Inmueble</th>
                <th className="px-4 py-3 font-medium">Inquilino</th>
                <th className="px-4 py-3 font-medium">Vigencia</th>
                <th className="px-4 py-3 text-right font-medium">Renta</th>
                <th className="px-4 py-3 text-right font-medium">Depósito</th>
                <th className="px-4 py-3 text-right font-medium">Mora/día</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gridline">
              {contratos.data.map((c) => {
                const propiedad = propiedades.data?.find((p) => p.id === c.propiedad_id);
                const inquilino = inquilinos.data?.find((i) => i.id === c.inquilino_id);
                return (
                  <tr
                    key={c.id}
                    className="cursor-pointer hover:bg-page/60"
                    onClick={() => setEditing(c)}
                  >
                    <td className="px-4 py-3 font-medium text-ink-primary">
                      {propiedad?.nombre_referencia ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {inquilino?.nombre_razon_social ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {formatDate(c.fecha_inicio)} – {formatDate(c.fecha_fin)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-primary">
                      {formatCurrency(c.renta_mensual)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-secondary">
                      {formatCurrency(c.deposito_garantia)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-secondary">
                      {formatCurrency(c.penalizacion_mora_diaria)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge role={contractStatusRole[c.estado]}>
                        {contractStatusLabels[c.estado]}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {showForm && (
        <ContratoFormModal
          propiedades={propiedades.data ?? []}
          inquilinos={inquilinos.data ?? []}
          onClose={() => setShowForm(false)}
        />
      )}
      {editing && (
        <ContratoFormModal
          propiedades={propiedades.data ?? []}
          inquilinos={inquilinos.data ?? []}
          contrato={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
