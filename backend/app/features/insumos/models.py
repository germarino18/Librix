"""Insumos — SQLAlchemy ORM models."""
import enum
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.base import Base
from app.shared.mixins import TimestampMixin


class TipoMovInsumo(str, enum.Enum):
    INGRESO = "ingreso"
    CONSUMO = "consumo"


class InsumoServicio(TimestampMixin, Base):
    __tablename__ = "insumos_servicio"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    stock_actual: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    unidad: Mapped[str] = mapped_column(String(50), default="unidad")
    costo_unitario: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    stock_minimo: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    paginas_por_unidad: Mapped[int | None] = mapped_column(Integer, nullable=True)

    movimientos: Mapped[list["MovimientoInsumo"]] = relationship(back_populates="insumo", cascade="all, delete-orphan")


class MovimientoInsumo(TimestampMixin, Base):
    __tablename__ = "movimientos_insumo"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    insumo_id: Mapped[str] = mapped_column(String(36), ForeignKey("insumos_servicio.id"), nullable=False)
    tipo: Mapped[TipoMovInsumo] = mapped_column(Enum(TipoMovInsumo, values_callable=lambda x: [e.value for e in x]), nullable=False)
    cantidad: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    fecha_hora: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    observacion: Mapped[str | None] = mapped_column(Text, nullable=True)

    insumo: Mapped[InsumoServicio] = relationship(back_populates="movimientos")
