import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { PropiedadesPage } from "@/pages/PropiedadesPage";
import { InquilinosPage } from "@/pages/InquilinosPage";
import { ContratosPage } from "@/pages/ContratosPage";
import { PagosPage } from "@/pages/PagosPage";
import { MantenimientoPage } from "@/pages/MantenimientoPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "propiedades", element: <PropiedadesPage /> },
      { path: "inquilinos", element: <InquilinosPage /> },
      { path: "contratos", element: <ContratosPage /> },
      { path: "pagos", element: <PagosPage /> },
      { path: "mantenimiento", element: <MantenimientoPage /> },
    ],
  },
]);
