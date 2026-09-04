import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentoRead(BaseModel):
    """Metadatos del documento (sin el contenido binario, que se sirve aparte
    vía el endpoint de descarga para no inflar las respuestas de listado)."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    nombre_archivo: str
    tipo_contenido: str
    tamano_bytes: int
    descripcion: str | None = None
    creado_en: datetime
    propiedad_ids: list[uuid.UUID] = []
