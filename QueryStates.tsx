export function LoadingState({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-12 text-sm text-ink-secondary">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-brand-450 border-t-transparent"
        aria-hidden
      />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-status-critical/10 px-4 py-3 text-sm text-status-critical ring-1 ring-status-critical/20">
      {message}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <p className="text-sm font-medium text-ink-primary">{title}</p>
      {description && <p className="mt-1 text-sm text-ink-secondary">{description}</p>}
    </div>
  );
}
