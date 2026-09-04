import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

tenant_type_enum = PGEnum(
    "persona_fisica", "persona_moral",
    name="tenant_type", create_type=False,
)


class Inquilino(Base):
    __tablename__ = "inquilinos"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    tipo_persona: Mapped[str] = mapped_column(
        tenant_type_enum, nullable=False, server_default="persona_fisica"
    )
    nombre_razon_social: Mapped[str] = mapped_column(String(255), nullable=False)
    rfc: Mapped[str | None] = mapped_column(String(13))
    representante_legal: Mapped[str | None] = mapped_column(String(255))
    email: Mapped[str | None] = mapped_column(String(255))
    telefono: Mapped[str | None] = mapped_column(String(20))
    direccion: Mapped[str | None] = mapped_column(Text)
    notas: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    contratos: Mapped[list["Contrato"]] = relationship(back_populates="inquilino")
