import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings


def _seed_if_requested() -> None:
    """Siembra los datos reales del portafolio en el arranque, solo si se pide
    explícitamente vía la variable de entorno SEED_ON_STARTUP=true. Es segura
    de dejar encendida: app.db.seed.seed() es idempotente (get-or-create), así
    que correrla en cada arranque/redeploy no duplica registros."""
    if os.getenv("SEED_ON_STARTUP", "false").lower() != "true":
        return
    try:
        from app.db.seed import seed

        seed()
    except Exception as exc:  # no tumbar el arranque de la API por un fallo de seed
        print(f"[startup] seed omitido por error: {exc}")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para la gestión de propiedades en alquiler: inmuebles, "
    "inquilinos, contratos, pagos y mantenimiento.",
    version="0.1.0",
)


@app.on_event("startup")
def on_startup() -> None:
    _seed_if_requested()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}
