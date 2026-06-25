"""Caja — SQLAlchemy ORM models."""
import enum
import uuid
from decimal import Decimal

from sqlalchemy import Date, Enum, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.base import Base
from app.shared.mixins import TimestampMixin


class EstadoCaja(str, enum.Enum):
    ABIERTA = "abierta"
    CERRADA = "cerrada"


class Caja(TimestampMixin, Base):
    __tablename__ = "cajas"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid.uuid4)
    fecha: Mapped[str] = mapped_column(Date, nullable=False)
    monto_inicial: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    monto_final: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    estado: Mapped[EstadoCaja] = mapped_column(Enum(EstadoCaja), default=EstadoCaja.ABIERTA)
    total_efectivo: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    total_transferencia: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    total_qr: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    total_servicios: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    observacion: Mapped[str | None] = mapped_column(Text, nullable=True)
