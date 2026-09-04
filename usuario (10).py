"""Dependencia de autenticación compartida por todos los routers protegidos."""
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import decode_access_token
from app.crud.usuario import usuario as crud_usuario
from app.models.usuario import Usuario

# tokenUrl es solo para que Swagger UI (/docs) sepa a dónde mandar el botón
# "Authorize"; no afecta la validación real del token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar la sesión",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        raw_id = payload.get("sub")
        if raw_id is None:
            raise credentials_exception
        user_id = uuid.UUID(raw_id)
    except (JWTError, ValueError):
        raise credentials_exception

    user = crud_usuario.get(db, user_id)
    if user is None or not user.activo:
        raise credentials_exception
    return user
