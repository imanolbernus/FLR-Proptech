import { formatCurrency } from "@/utils/format";

interface Row {
  id: string;
  label: string;
  value: number;
}

/**
 * Barras horizontales de magnitud (una sola serie: renta mensual conocida
 * por inmueble) — un solo hue (brand), extremos redondeados, etiqueta
 * directa con el valor, sin leyenda (una sola serie no la necesita).
 * Ver dataviz/references/marks-and-anatomy.md.
 */
export function RentByPropertyChart({ rows }: { rows: Row[] }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  const sorted = [...rows].sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((row) => {
        const pct = Math.max((row.value / max) * 100, 2);
        return (
          <div key={row.id} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-sm text-ink-secondary" title={row.label}>
              {row.label}
            </span>
            <div className="relative h-3 flex-1 rounded-full bg-gridline">
              <div
                className="h-3 rounded-full bg-brand-450"
                style={{ width: `${pct}%` }}
                role="img"
                aria-label={`${row.label}: ${formatCurrency(row.value)} al mes`}
              />
            </div>
            <span className="w-28 shrink-0 text-right text-sm font-medium tabular-nums text-ink-primary">
              {formatCurrency(row.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
