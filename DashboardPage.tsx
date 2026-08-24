import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState, ErrorState } from "@/components/common/QueryStates";
import { StatTile } from "@/components/ui/StatTile";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { usePropiedades, useInquilinos, useContratos, usePagos } from "@/hooks/useEntities";
import { RentByPropertyChart } from "@/features/dashboard/RentByPropertyChart";
import { formatCurrency } from "@/utils/format";
import { contractStatusLabels, contractStatusRole } from "@/utils/labels";

export function DashboardPage() {
  const propiedades = usePropiedades();
  const inquilinos = useInquilinos();
  const contratos = useContratos();
  const pagos = usePagos();

  const isLoading = propiedades.isLoading || inquilinos.isLoading || contratos.isLoading;
  const error = propiedades.error || inquilinos.error || contratos.error;

  if (isLoading) return <LoadingState label="Cargando resumen del portafolio…" />;
  if (error) {
    return (
      <ErrorState message="No se pudo conectar con la API. ¿Está corriendo el backend (uvicorn) en http://127.0.0.1:8000?" />
    );
  }

  const props = propiedades.data ?? [];
  const contratosData = contratos.data ?? [];
  const pagosAtrasados = (pagos.data ?? []).filter((p) => p.estado === "atrasado");

  const rentaTotalMensual = props.reduce((sum, p) => sum + Number(p.renta_base), 0);
  const contratosPorVencerORenovar = contratosData.filter((c) => c.estado === "vencido").length;

  const rows = props.map((p) => ({
    id: p.id,
    label: p.nombre_referencia,
    value: Number(p.renta_base),
  }));

  return (
    <div>
      <PageHeader
        title="Resumen del portafolio"
        description="Federico López Rodea — 5 inmuebles en la Ciudad de México."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Inmuebles" value={String(props.length)} />
        <StatTile
          label="Renta mensual conocida (+IVA)"
          value={formatCurrency(rentaTotalMensual)}
          sublabel={`Anualizado: ${formatCurrency(rentaTotalMensual * 12)}`}
        />
        <StatTile label="Inquilinos" value={String((inquilinos.data ?? []).length)} />
        <StatTile
          label="Contratos en prórroga (sin firma vigente)"
          value={String(contratosPorVencerORenovar)}
          sublabel="Requieren renovación 2026"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-ink-primary">Renta mensual por inmueble</h2>
          <RentByPropertyChart rows={rows} />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-primary">Estado de contratos</h2>
          <ul className="flex flex-col gap-3">
            {contratosData.map((c) => {
              const propiedad = props.find((p) => p.id === c.propiedad_id);
              return (
                <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                  <span
                    className="min-w-0 flex-1 truncate text-ink-secondary"
                    title={propiedad?.nombre_referencia}
                  >
                    {propiedad?.nombre_referencia ?? "—"}
                  </span>
                  <span className="shrink-0 whitespace-nowrap">
                    <Badge role={contractStatusRole[c.estado]}>{contractStatusLabels[c.estado]}</Badge>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {pagosAtrasados.length > 0 && (
        <Card className="mt-4 p-5">
          <h2 className="mb-2 text-sm font-semibold text-status-critical">Pagos atrasados</h2>
          <p className="text-sm text-ink-secondary">
            {pagosAtrasados.length} pago(s) marcados como atrasados. Revisa la sección de Pagos.
          </p>
        </Card>
      )}
    </div>
  );
}
