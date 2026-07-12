"""Servicios — SQLAlchemy ORM models."""
import enum
import uuid
from decimal import Decimal

from sqlalchemy import Date, Enum, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.base import Base
from app.shared.mixins import TimestampMixin


class TipoServicio(str, enum.Enum):
    FOTOCOPIA = "fotocopia"
    PLASTIFICADO = "plastificado"
    SOUVENIR = "souvenir"
    OTRO = "otro"


class RegistroServicio(TimestampMixin, Base):
    __tablename__ = "registros_servicio"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    fecha: Mapped[str] = mapped_column(Date, nullable=False)
    tipo: Mapped[TipoServicio] = mapped_column(Enum(TipoServicio, values_callable=lambda x: [e.value for e in x]), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    cantidad: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=1)
    ingreso_total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    costo_insumos: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    ganancia: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
