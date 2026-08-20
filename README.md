# FLR PropTech

Sistema de gestión de propiedades en renta para el portafolio de Federico López Rodea
(5 bodegas: Cuitláhuac 88-A, 88-B, 94, Francisco Novoa 41 y 43).

- `backend/` — API en FastAPI + PostgreSQL (SQLAlchemy, Alembic).
- `frontend/` — Interfaz en React + Vite + TypeScript + Tailwind.

## Subir este código a GitHub (para desplegarlo en Render)

1. Entra a https://github.com/new, inicia sesión (o crea una cuenta gratis) y crea un
   repositorio nuevo. Puede ser público. Nómbralo por ejemplo `flr-proptech`. **No**
   marques las opciones de agregar README/licencia/.gitignore — debe quedar vacío.
2. En la página del repositorio recién creado, busca el enlace **"uploading an
   existing file"** (junto a "...or push an existing repository from the command
   line").
3. Descomprime el zip que te compartí y arrastra la carpeta completa
   `flr-proptech-deploy` (o su contenido: `backend/`, `frontend/`, este `README.md`
   y el `.gitignore`) a la zona de arrastre de esa página. Espera a que termine de
   cargar todos los archivos.
4. Baja hasta el final de la página y da clic en **"Commit changes"**.
5. Copia la URL del repositorio (la barra de direcciones, algo como
   `https://github.com/tu-usuario/flr-proptech`) y compártemela — con eso conecto
   Render y termino el despliegue.

No necesitas instalar Git ni nada más en tu computadora para este paso.
