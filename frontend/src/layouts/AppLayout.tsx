import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Resumen", end: true },
  { to: "/propiedades", label: "Propiedades" },
  { to: "/inquilinos", label: "Inquilinos" },
  { to: "/contratos", label: "Contratos" },
  { to: "/pagos", label: "Pagos" },
  { to: "/mantenimiento", label: "Mantenimiento" },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 md:flex">
          <div className="mb-8 px-2">
            <p className="text-sm font-semibold tracking-tight text-ink-primary">FLR PropTech</p>
            <p className="text-xs text-ink-muted">Portafolio de rentas</p>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-100 text-brand-700"
                      : "text-ink-secondary hover:bg-page hover:text-ink-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1 px-4 py-6 md:px-8">
          <header className="mb-4 flex items-center justify-between md:hidden">
            <p className="text-sm font-semibold text-ink-primary">FLR PropTech</p>
          </header>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
