import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, LargeBinary, String, Table, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

# Tabla puente: un documento (p.ej. un estado de cuenta que cubre varios
# inmuebles facturados en conjunto) puede vincularse a una o más propiedades,
# y una propiedad puede tener varios documentos.
documento_propiedades = Table(
    "documento_propiedades",
    Base.metadata,
    Column(
        "documento_id",
        UUID(as_uuid=True),
        ForeignKey("documentos.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "propiedad_id",
        UUID(as_uuid=True),
        ForeignKey("propiedades.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Documento(Base):
    """Documento adjunto (estado de cuenta, contrato escaneado, comprobante,
    etc.) asociado a una o más propiedades. El contenido binario se guarda
    directamente en la base de datos (sin dependencias de almacenamiento
    externo), lo cual es adecuado para el volumen de archivos de este
    portafolio (PDFs/Word/Excel de unos cuantos MB cada uno)."""

    __tablename__ = "documentos"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    nombre_archivo: Mapped[str] = mapped_column(String(255), nullable=False)
    tipo_contenido: Mapped[str] = mapped_column(String(150), nullable=False)
    tamano_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    descripcion: Mapped[str | None] = mapped_column(Text)
    contenido: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    propiedades: Mapped[list["Propiedad"]] = relationship(
        secondary=documento_propiedades, back_populates="documentos"
    )
