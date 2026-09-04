import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/", label: "Resumen", end: true },
  { to: "/propiedades", label: "Propiedades" },
  { to: "/inquilinos", label: "Inquilinos" },
  { to: "/contratos", label: "Contratos" },
  { to: "/pagos", label: "Pagos" },
  { to: "/mantenimiento", label: "Mantenimiento" },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cierra el menú móvil cada vez que cambia de página.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-100 text-brand-700"
        : "text-ink-secondary hover:bg-page hover:text-ink-primary"
    }`;

  return (
    <div className="min-h-screen bg-page">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 md:flex">
          <div className="mb-8 px-2">
            <p className="text-sm font-semibold tracking-tight text-ink-primary">FLR PropTech</p>
            <p className="text-xs text-ink-muted">Portafolio de rentas</p>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t border-border pt-4">
            {user && (
              <p className="truncate px-2 text-xs text-ink-muted" title={user.email}>
                {user.nombre}
              </p>
            )}
            <button
              onClick={logout}
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-secondary transition-colors hover:bg-page hover:text-ink-primary"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-6 md:px-8">
          <header className="mb-4 flex items-center justify-between md:hidden">
            <p className="text-sm font-semibold text-ink-primary">FLR PropTech</p>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary ring-1 ring-border hover:bg-surface"
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M2 2L16 16M16 2L2 16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                  <path
                    d="M0 1H18M0 7H18M0 13H18"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </header>

          {menuOpen && (
            <nav className="mb-4 flex flex-col gap-1 rounded-xl border border-border bg-surface p-2 md:hidden">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-1 border-t border-border pt-2">
                {user && (
                  <p className="truncate px-3 py-1 text-xs text-ink-muted" title={user.email}>
                    {user.nombre}
                  </p>
                )}
                <button
                  onClick={logout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-secondary transition-colors hover:bg-page hover:text-ink-primary"
                >
                  Cerrar sesión
                </button>
              </div>
            </nav>
          )}

          <div className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
