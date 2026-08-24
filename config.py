"""Configuración centralizada de la aplicación (variables de entorno)."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "FLR PropTech API"
    API_V1_PREFIX: str = "/api/v1"

    # Cadena de conexión a PostgreSQL. Usar el driver psycopg (v3).
    DATABASE_URL: str = (
        "postgresql+psycopg://flr_user:flr_password@localhost:5432/flr_proptech"
    )

    # Seguridad / JWT
    SECRET_KEY: str = "CAMBIAR-EN-PRODUCCION-usar-una-cadena-aleatoria-larga"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 día

    # CORS: orígenes permitidos para el frontend (Vite corre en 5173 por defecto)
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
