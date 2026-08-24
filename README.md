# FLR PropTech — Backend (Fase 2)

API en FastAPI para el portafolio de 5 inmuebles de Federico López Rodea
(Cuitláhuac 88-A, 88-B, 94, Francisco Novoa 41 y 43). Ya probada end-to-end
en este entorno: migraciones con Alembic, arranque del servidor, siembra de
los datos reales del portafolio y pruebas de los endpoints con curl.

## Setup rápido

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env   # ajustar DATABASE_URL si es necesario

# Crear rol y base de datos en PostgreSQL (ejemplo):
#   CREATE ROLE flr_user LOGIN PASSWORD 'flr_password';
#   CREATE DATABASE flr_proptech OWNER flr_user;
#   -- pgcrypto (para gen_random_uuid()) requiere permisos de superusuario
#   -- o que el rol tenga CREATE EXTENSION; en dev puedes hacer al rol SUPERUSER.

alembic upgrade head          # aplica el esquema (equivalente a app/db/schema.sql)
python -m app.db.seed         # siembra las 5 propiedades / 3 inquilinos / 5 contratos reales
uvicorn app.main:app --reload # arranca la API en http://127.0.0.1:8000
```

Documentación interactiva (Swagger) en `http://127.0.0.1:8000/docs`.

## Qué incluye esta fase

- Modelos SQLAlchemy 2.0 y schemas Pydantic v2 para las 6 entidades de la Fase 1.
- CRUD genérico (`app/crud/base.py`) + CRUD específico por entidad con filtros
  útiles (contratos por propiedad, pagos por contrato/estado, tickets por propiedad).
- Endpoints REST completos (`GET` lista, `GET` por id, `POST`, `PATCH`, `DELETE`)
  para usuarios, propiedades, inquilinos, contratos, pagos y tickets de mantenimiento.
- Regla de negocio aplicada en el endpoint de contratos: no se puede crear un
  segundo contrato `activo` para la misma propiedad (además del índice único
  parcial ya existente a nivel de base de datos).
- Alembic configurado y con la migración inicial (`0001_initial_schema`),
  probada con `upgrade` y `downgrade` completos.
- `app/db/seed.py`: siembra idempotente con los datos REALES de los 5 inmuebles
  (el último contrato conocido de cada uno), documentando explícitamente qué
  datos no están confirmados en los resúmenes de contrato (RFC, superficie en
  m², email/teléfono de contacto) en vez de inventarlos.

## Pendiente para próximas fases

- Autenticación real (endpoint de login que devuelva el JWT; por ahora solo
  existen las utilidades en `app/core/security.py`).
- Endpoints protegidos por rol (`admin` / `property_manager` / `viewer`).
- Carga del historial completo de contratos por inmueble (hasta 11 por
  inmueble) si se decide llevarlo a la base de datos, no solo el más reciente.
- Registrar pagos y tickets reales conforme se generen (no hay datos
  documentados de pagos/mantenimiento todavía, así que no se sembraron).
