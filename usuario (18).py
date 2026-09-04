import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, CheckConstraint, Date, DateTime, ForeignKey, Index, Numeric, String, Text, func, text
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

contract_status_enum = PGEnum(
    "borrador", "activo", "vencido", "renovado", "terminado_anticipadamente",
    name="contract_status", create_type=False,
)


class Contrato(Base):
    __tablename__ = "contratos"
    __table_args__ = (
        CheckConstraint("fecha_fin > fecha_inicio", name="chk_contrato_fechas"),
        # Solo un contrato "activo" por inmueble a la vez (índice único parcial,
        # ya creado por app/db/schema.sql — declarado aquí también por documentación).
        Index(
            "uq_contrato_activo_por_propiedad",
            "propiedad_id",
            unique=True,
            postgresql_where=text("estado = 'activo'"),
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    propiedad_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("propiedades.id", ondelete="RESTRICT"), nullable=False
    )
    inquilino_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("inquilinos.id", ondelete="RESTRICT"), nullable=False
    )
    fecha_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[date] = mapped_column(Date, nullable=False)
    renta_mensual: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    renta_incluye_iva: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    deposito_garantia: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, server_default="0")
    penalizacion_mora_diaria: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, server_default="0")
    ajuste_indexado_inpc: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    margen_ajuste_pp: Mapped[float | None] = mapped_column(Numeric(5, 2))
    uso_permitido: Mapped[str | None] = mapped_column(String(255))
    jurisdiccion: Mapped[str | None] = mapped_column(String(150))
    estado: Mapped[str] = mapped_column(contract_status_enum, nullable=False, server_default="activo")
    archivo_url: Mapped[str | None] = mapped_column(Text)
    notas: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    propiedad: Mapped["Propiedad"] = relationship(back_populates="contratos")
    inquilino: Mapped["Inquilino"] = relationship(back_populates="contratos")
    pagos: Mapped[list["Pago"]] = relationship(back_populates="contrato", cascade="all, delete-orphan")
    tickets: Mapped[list["TicketMantenimiento"]] = relationship(back_populates="contrato")
