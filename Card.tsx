import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-sm shadow-black/[0.02] ${className}`}
    >
      {children}
    </div>
  );
}
