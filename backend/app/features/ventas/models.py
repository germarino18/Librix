"""Ventas — SQLAlchemy ORM models."""
import enum
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.base import Base
from app.shared.mixins import TimestampMixin


class MetodoPago(str, enum.Enum):
    EFECTIVO = "efectivo"
    TRANSFERENCIA = "transferencia"
    QR_MERCADOPAGO = "qr_mercadopago"


class EstadoVenta(str, enum.Enum):
    COMPLETADA = "completada"
    CANCELADA = "cancelada"


class Venta(TimestampMixin, Base):
    __tablename__ = "ventas"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    fecha_hora: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    metodo_pago: Mapped[MetodoPago] = mapped_column(Enum(MetodoPago, values_callable=lambda x: [e.value for e in x]), nullable=False)
    estado: Mapped[EstadoVenta] = mapped_column(Enum(EstadoVenta, values_callable=lambda x: [e.value for e in x]), default=EstadoVenta.COMPLETADA)
    observacion: Mapped[str | None] = mapped_column(Text, nullable=True)

    detalles: Mapped[list["DetalleVenta"]] = relationship(back_populates="venta", cascade="all, delete-orphan")


class DetalleVenta(TimestampMixin, Base):
    __tablename__ = "detalles_venta"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    venta_id: Mapped[str] = mapped_column(String(36), ForeignKey("ventas.id"), nullable=False)
    producto_id: Mapped[str] = mapped_column(String(36), ForeignKey("productos.id"), nullable=False)
    cantidad: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    precio_unitario: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    venta: Mapped[Venta] = relationship(back_populates="detalles")
    producto: Mapped["Producto"] = relationship()  # noqa: F821
