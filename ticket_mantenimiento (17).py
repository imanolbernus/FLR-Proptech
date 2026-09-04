import uuid
from datetime import date, datetime

from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKey, Numeric, Text, func
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

payment_status_enum = PGEnum(
    "pendiente", "pagado", "atrasado", "pago_parcial", "cancelado",
    name="payment_status", create_type=False,
)
payment_method_enum = PGEnum(
    "transferencia", "efectivo", "cheque", "deposito_bancario", "tarjeta", "otro",
    name="payment_method", create_type=False,
)


class Pago(Base):
    __tablename__ = "pagos"
    __table_args__ = (
        CheckConstraint(
            "(estado = 'pagado' AND fecha_pago IS NOT NULL) OR (estado <> 'pagado')",
            name="chk_pago_fecha_pago",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    contrato_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("contratos.id", ondelete="CASCADE"), nullable=False
    )
    monto: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    fecha_vencimiento: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_pago: Mapped[date | None] = mapped_column(Date)
    estado: Mapped[str] = mapped_column(payment_status_enum, nullable=False, server_default="pendiente")
    metodo_pago: Mapped[str | None] = mapped_column(payment_method_enum)
    comprobante_url: Mapped[str | None] = mapped_column(Text)
    notas: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    contrato: Mapped["Contrato"] = relationship(back_populates="pagos")
