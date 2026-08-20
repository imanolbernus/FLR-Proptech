"""Importa todos los modelos para que SQLAlchemy configure las relaciones
entre ellos correctamente (evita errores de mapeo por referencias circulares
en forma de string)."""
from app.models.usuario import Usuario  # noqa: F401
from app.models.propiedad import Propiedad  # noqa: F401
from app.models.inquilino import Inquilino  # noqa: F401
from app.models.contrato import Contrato  # noqa: F401
from app.models.pago import Pago  # noqa: F401
from app.models.ticket_mantenimiento import TicketMantenimiento  # noqa: F401

__all__ = [
    "Usuario",
    "Propiedad",
    "Inquilino",
    "Contrato",
    "Pago",
    "TicketMantenimiento",
]
