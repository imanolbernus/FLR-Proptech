import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/QueryStates";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { usePropiedades, useTickets } from "@/hooks/useEntities";
import { TicketFormModal } from "@/features/mantenimiento/TicketFormModal";
import { formatDate } from "@/utils/format";
import { ticketPriorityLabels, ticketPriorityRole, ticketStatusLabels, ticketStatusRole } from "@/utils/labels";
import type { TicketMantenimiento } from "@/types/entities";

export function MantenimientoPage() {
  const tickets = useTickets();
  const propiedades = usePropiedades();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TicketMantenimiento | null>(null);

  const hayPropiedades = (propiedades.data ?? []).length > 0;

  return (
    <div>
      <PageHeader
        title="Mantenimiento"
        description="Tickets de mantenimiento por inmueble."
        actions={
          <Button onClick={() => setShowForm(true)} disabled={!hayPropiedades}>
            + Nuevo ticket
          </Button>
        }
      />

      {tickets.isLoading && <LoadingState />}
      {tickets.error && <ErrorState message="No se pudieron cargar los tickets." />}

      {tickets.data && tickets.data.length === 0 && (
        <EmptyState
          title="Sin tickets de mantenimiento"
          description="No hay incidencias documentadas todavía. Crea el primer ticket cuando surja una."
        />
      )}

      {tickets.data && tickets.data.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Inmueble</th>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Prioridad</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Apertura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gridline">
              {tickets.data.map((t) => {
                const propiedad = propiedades.data?.find((p) => p.id === t.propiedad_id);
                return (
                  <tr
                    key={t.id}
                    className="cursor-pointer hover:bg-page/60"
                    onClick={() => setEditing(t)}
                  >
                    <td className="px-4 py-3 font-medium text-ink-primary">
                      {propiedad?.nombre_referencia ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{t.titulo}</td>
                    <td className="px-4 py-3">
                      <Badge role={ticketPriorityRole[t.prioridad]}>
                        {ticketPriorityLabels[t.prioridad]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge role={ticketStatusRole[t.estado]}>{ticketStatusLabels[t.estado]}</Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{formatDate(t.fecha_apertura)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {showForm && (
        <TicketFormModal propiedades={propiedades.data ?? []} onClose={() => setShowForm(false)} />
      )}
      {editing && (
        <TicketFormModal
          propiedades={propiedades.data ?? []}
          ticket={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
