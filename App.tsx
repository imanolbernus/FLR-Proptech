# Copiar a .env y ajustar valores reales. Nunca subir .env a git.

DATABASE_URL=postgresql+psycopg://flr_user:flr_password@localhost:5432/flr_proptech
SECRET_KEY=cambia-esto-por-una-cadena-aleatoria-larga-en-produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
