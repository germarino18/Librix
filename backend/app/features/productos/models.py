"""Productos — SQLAlchemy ORM models."""
import uuid
from decimal import Decimal

from sqlalchemy import Boolean, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.base import Base
from app.shared.mixins import TimestampMixin


class Categoria(TimestampMixin, Base):
    __tablename__ = "categorias"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    productos: Mapped[list["Producto"]] = relationship(back_populates="categoria")


class Producto(TimestampMixin, Base):
    __tablename__ = "productos"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    precio_compra: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    precio_venta: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    porcentaje_ganancia: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True, default=None)
    stock_actual: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    stock_minimo: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    unidad: Mapped[str] = mapped_column(String(50), default="unidad")
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    categoria_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("categorias.id", ondelete="RESTRICT"), nullable=True)

    categoria: Mapped[Categoria | None] = relationship(back_populates="productos")
