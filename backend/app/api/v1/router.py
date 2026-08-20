from fastapi import APIRouter

from app.api.v1.endpoints import contratos, inquilinos, pagos, propiedades, tickets, usuarios

api_router = APIRouter()
api_router.include_router(usuarios.router)
api_router.include_router(propiedades.router)
api_router.include_router(inquilinos.router)
api_router.include_router(contratos.router)
api_router.include_router(pagos.router)
api_router.include_router(tickets.router)
