import uuid
from datetime import date, datetime

from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

ticket_priority_enum = PGEnum(
    "baja", "media", "alta", "urgente",
    name="ticket_priority", create_type=False,
)
ticket_status_enum = PGEnum(
    "abierto", "en_proceso", "resuelto", "cancelado",
    name="ticket_status", create_type=False,
)


class TicketMantenimiento(Base):
    __tablename__ = "tickets_mantenimiento"
    __table_args__ = (
        CheckConstraint(
            "(estado IN ('resuelto', 'cancelado') AND fecha_cierre IS NOT NULL) "
            "OR (estado NOT IN ('resuelto', 'cancelado'))",
            name="chk_ticket_cierre",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    propiedad_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("propiedades.id", ondelete="CASCADE"), nullable=False
    )
    contrato_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("contratos.id", ondelete="SET NULL")
    )
    reportado_por: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="SET NULL")
    )
    titulo: Mapped[str] = mapped_column(String(200), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    prioridad: Mapped[str] = mapped_column(ticket_priority_enum, nullable=False, server_default="media")
    estado: Mapped[str] = mapped_column(ticket_status_enum, nullable=False, server_default="abierto")
    asignado_a: Mapped[str | None] = mapped_column(String(150))
    costo_estimado: Mapped[float | None] = mapped_column(Numeric(12, 2))
    costo_real: Mapped[float | None] = mapped_column(Numeric(12, 2))
    fecha_apertura: Mapped[date] = mapped_column(Date, nullable=False, server_default=func.current_date())
    fecha_cierre: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    propiedad: Mapped["Propiedad"] = relationship(back_populates="tickets")
    contrato: Mapped["Contrato | None"] = relationship(back_populates="tickets")
    reportado_por_usuario: Mapped["Usuario | None"] = relationship(back_populates="tickets_reportados")
