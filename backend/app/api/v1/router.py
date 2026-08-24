from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.api.v1.endpoints import auth, contratos, inquilinos, pagos, propiedades, tickets, usuarios

api_router = APIRouter()

# /auth/login es público (es como se obtiene el token); todo lo demás exige sesión.
api_router.include_router(auth.router)

protected_router = APIRouter(dependencies=[Depends(get_current_user)])
protected_router.include_router(usuarios.router)
protected_router.include_router(propiedades.router)
protected_router.include_router(inquilinos.router)
protected_router.include_router(contratos.router)
protected_router.include_router(pagos.router)
protected_router.include_router(tickets.router)

api_router.include_router(protected_router)
