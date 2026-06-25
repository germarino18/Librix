"""Productos — Pydantic schemas."""
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ── Categoria ──

class CategoriaBase(BaseModel):
    nombre: str


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaResponse(CategoriaBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime
    updated_at: datetime


# ── Producto ──

class ProductoBase(BaseModel):
    nombre: str
    precio_compra: Decimal = Decimal("0")
    precio_venta: Decimal = Decimal("0")
    stock_actual: Decimal = Decimal("0")
    stock_minimo: Decimal = Decimal("0")
    unidad: str = "unidad"
    activo: bool = True
    categoria_id: Optional[str] = None


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    precio_compra: Optional[Decimal] = None
    precio_venta: Optional[Decimal] = None
    stock_actual: Optional[Decimal] = None
    stock_minimo: Optional[Decimal] = None
    unidad: Optional[str] = None
    activo: Optional[bool] = None
    categoria_id: Optional[str] = None


class ProductoResponse(ProductoBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime
    updated_at: datetime
