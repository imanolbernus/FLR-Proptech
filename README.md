# FLR PropTech — Frontend (Fase 3)

React + Vite + TypeScript + Tailwind CSS v4, conectado al backend de la Fase 2.
Probado end-to-end contra la API real (Postgres 16 + FastAPI corriendo en este
mismo entorno): se navegaron las 6 páginas con Playwright/Chromium, se
verificó que los datos reales del portafolio se muestran correctamente, y se
probaron los formularios de creación (propiedad y pago) contra la API real.

## Setup rápido

```bash
cd frontend
npm install
cp .env.example .env.local   # ajustar VITE_API_BASE_URL si el backend no está en localhost:8000
npm run dev                  # http://localhost:5173
```

Requiere el backend de la Fase 2 corriendo (`uvicorn app.main:app --reload`
en `backend/`) con la base de datos migrada y sembrada.

## Qué incluye esta fase

- **Resumen (dashboard):** KPIs del portafolio (inmuebles, renta mensual
  conocida +IVA, inquilinos, contratos en prórroga) + gráfica de barras de
  renta por inmueble + lista de estado de contratos. Los números coinciden
  con los documentados en el proyecto ($226,810.00 de renta mensual conocida
  2025, $2,721,720.00 anualizado).
- **Propiedades:** tabla del portafolio + formulario de alta.
- **Inquilinos:** tabla + formulario de alta (persona física/moral).
- **Contratos:** tabla de solo lectura con inmueble, inquilino, vigencia,
  renta, depósito, mora diaria y estado (resuelve las relaciones contra
  propiedades/inquilinos en el cliente).
- **Pagos:** tabla + formulario de registro de pago por contrato.
- **Mantenimiento:** tabla + formulario de alta de tickets.
- Cliente API tipado (`src/api/`) que espeja los schemas Pydantic del
  backend, con manejo de errores contra el formato `{"detail": ...}` de FastAPI.
- Paleta de color y specs de marca (barras, badges de estado) tomados de la
  skill de dataviz del sistema — colores de estado (`good/warning/serious/
  critical`) reservados y nunca reusados como color de serie.
- `@tanstack/react-query` para cache/loading/error de las peticiones.

## Pendiente para próximas fases

- Edición/eliminación desde la UI (el backend ya soporta `PATCH`/`DELETE`;
  falta conectarlos en Contratos, Pagos y Tickets).
- Pantalla de login (el backend aún no expone un endpoint de autenticación).
- Filtros y paginación reales en las tablas (hoy se listan hasta 100 registros).
- Vista de detalle por inmueble (historial completo de contratos, pagos y
  tickets en una sola pantalla).
