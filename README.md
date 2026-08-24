# FLR PropTech

Sistema de gestión de propiedades en renta para el portafolio de Federico López Rodea
(5 bodegas: Cuitláhuac 88-A, 88-B, 94, Francisco Novoa 41 y 43).

- `backend/` — API en FastAPI + PostgreSQL (SQLAlchemy, Alembic).
- `frontend/` — Interfaz en React + Vite + TypeScript + Tailwind.

## Acceso

La app y el API ya piden inicio de sesión (antes eran públicos). Cuenta
admin sembrada automáticamente al desplegar:

- Correo: `federico.lopez@flr-proptech.app`
- Contraseña: `G9thcej5oHSbVz`

Cámbiala en cuanto puedas desde `/docs` del backend (`PATCH /usuarios/{id}`,
autenticado con el botón "Authorize" usando este mismo login).

## Actualizar el código en GitHub

1. Descomprime este zip. Debe quedar una carpeta con `backend/`, `frontend/`,
   `README.md` y `.gitignore` adentro.
2. Entra a tu repositorio en GitHub, ve a "Add file" → "Upload files".
3. Selecciona los 4 elementos de adentro de la carpeta descomprimida
   (`backend`, `frontend`, `README.md`, `.gitignore`) y arrástralos a la zona
   de subida. GitHub reemplaza automáticamente los archivos que ya existían
   con el mismo nombre y agrega los nuevos.
4. Baja y da clic en "Commit changes" — Render detecta el cambio y despliega
   solo, sin que tengas que hacer nada más.
