import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/QueryStates";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useContratos, usePagos, usePropiedades } from "@/hooks/useEntities";
import { PagoFormModal } from "@/features/pagos/PagoFormModal";
import { formatCurrency, formatDate } from "@/utils/format";
import { paymentStatusLabels, paymentStatusRole } from "@/utils/labels";
import type { Pago } from "@/types/entities";

export function PagosPage() {
  const pagos = usePagos();
  const contratos = useContratos();
  const propiedades = usePropiedades();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Pago | null>(null);

  const isLoading = pagos.isLoading || contratos.isLoading || propiedades.isLoading;
  const hayContratos = (contratos.data ?? []).length > 0;

  return (
    <div>
      <PageHeader
        title="Pagos"
        description="Registro de pagos de renta por contrato."
        actions={
          <Button onClick={() => setShowForm(true)} disabled={!hayContratos}>
            + Registrar pago
          </Button>
        }
      />

      {isLoading && <LoadingState />}
      {pagos.error && <ErrorState message="No se pudieron cargar los pagos." />}

      {pagos.data && pagos.data.length === 0 && (
        <EmptyState
          title="Aún no hay pagos registrados"
          description="Los 5 contratos reales sembrados no incluyen historial de pagos (no estaba documentado). Registra el primero cuando ocurra."
        />
      )}

      {pagos.data && pagos.data.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Inmueble</th>
                <th className="px-4 py-3 font-medium">Vencimiento</th>
                <th className="px-4 py-3 font-medium">Fecha de pago</th>
                <th className="px-4 py-3 text-right font-medium">Monto</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gridline">
              {pagos.data.map((pago) => {
                const contrato = contratos.data?.find((c) => c.id === pago.contrato_id);
                const propiedad = propiedades.data?.find((p) => p.id === contrato?.propiedad_id);
                return (
                  <tr
                    key={pago.id}
                    className="cursor-pointer hover:bg-page/60"
                    onClick={() => setEditing(pago)}
                  >
                    <td className="px-4 py-3 font-medium text-ink-primary">
                      {propiedad?.nombre_referencia ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {formatDate(pago.fecha_vencimiento)}
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{formatDate(pago.fecha_pago)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-primary">
                      {formatCurrency(pago.monto)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge role={paymentStatusRole[pago.estado]}>
                        {paymentStatusLabels[pago.estado]}
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
        <PagoFormModal
          contratos={contratos.data ?? []}
          propiedades={propiedades.data ?? []}
          onClose={() => setShowForm(false)}
        />
      )}
      {editing && (
        <PagoFormModal
          contratos={contratos.data ?? []}
          propiedades={propiedades.data ?? []}
          pago={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
