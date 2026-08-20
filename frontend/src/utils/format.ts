const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

/** Formatea un string/number NUMERIC del backend como moneda MXN (ej. "9000.00" -> "$9,000.00"). */
export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return "—";
  return currencyFormatter.format(n);
}

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  timeZone: "UTC",
});

/** Formatea una fecha ISO (YYYY-MM-DD) del backend sin desfase de zona horaria. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "—";
  return dateFormatter.format(d);
}

export function formatAddress(p: {
  calle: string;
  numero_exterior: string | null;
  numero_interior: string | null;
  colonia: string | null;
  ciudad: string;
}): string {
  const numero = [p.numero_exterior, p.numero_interior].filter(Boolean).join("-");
  const partes = [numero ? `${p.calle} ${numero}` : p.calle, p.colonia, p.ciudad].filter(Boolean);
  return partes.join(", ");
}
