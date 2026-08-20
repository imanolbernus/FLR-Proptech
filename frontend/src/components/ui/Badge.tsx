import type { ReactNode } from "react";
import { statusRoleClasses } from "@/utils/labels";

type StatusRole = keyof typeof statusRoleClasses;

export function Badge({ role, children }: { role: StatusRole; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusRoleClasses[role]}`}
    >
      {children}
    </span>
  );
}
