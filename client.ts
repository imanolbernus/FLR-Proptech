import { Card } from "./Card";

export function StatTile({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm text-ink-secondary">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-primary">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-ink-muted">{sublabel}</p>}
    </Card>
  );
}
