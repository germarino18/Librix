"""Insumos — Pydantic schemas."""
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.features.insumos.models import TipoMovInsumo


# ── InsumoServicio ──

class InsumoBase(BaseModel):
    nombre: str
    costo_unitario: Decimal = Decimal("0")
    unidad: str = "unidad"
    stock_minimo: Decimal = Decimal("0")
    paginas_por_unidad: Optional[int] = None


class InsumoCreate(InsumoBase):
    stock_actual: Decimal = Decimal("0")


class InsumoUpdate(BaseModel):
    nombre: Optional[str] = None
    costo_unitario: Optional[Decimal] = None
    unidad: Optional[str] = None
    stock_minimo: Optional[Decimal] = None
    paginas_por_unidad: Optional[int] = None


class InsumoResponse(InsumoBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    stock_actual: Decimal
    stock_bajo: bool
    created_at: datetime
    updated_at: datetime


# ── MovimientoInsumo ──

class MovimientoCreate(BaseModel):
    tipo: TipoMovInsumo
    cantidad: Decimal = Field(gt=0)
    observacion: Optional[str] = None


class MovimientoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    insumo_id: str
    tipo: TipoMovInsumo
    cantidad: Decimal
    fecha_hora: datetime
    observacion: Optional[str] = None
    created_at: datetime
    updated_at: datetime
