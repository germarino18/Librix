"""Stock — SQLAlchemy ORM models."""
import enum
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.base import Base
from app.shared.mixins import TimestampMixin


class TipoMovimiento(str, enum.Enum):
    INGRESO = "ingreso"
    VENTA = "venta"
    AJUSTE = "ajuste"


class MovimientoStock(TimestampMixin, Base):
    __tablename__ = "movimientos_stock"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    producto_id: Mapped[str] = mapped_column(String(36), ForeignKey("productos.id"), nullable=False)
    tipo: Mapped[TipoMovimiento] = mapped_column(Enum(TipoMovimiento, values_callable=lambda x: [e.value for e in x]), nullable=False)
    cantidad: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    fecha_hora: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    observacion: Mapped[str | None] = mapped_column(Text, nullable=True)

    producto: Mapped["Producto"] = relationship()  # noqa: F821
