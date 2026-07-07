"""Ventas — Pydantic schemas."""
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.features.ventas.models import EstadoVenta, MetodoPago


# ── DetalleVenta ──

class DetalleVentaBase(BaseModel):
    producto_id: str
    cantidad: Decimal = Field(gt=0)
    precio_unitario: Decimal = Field(ge=0)
    subtotal: Decimal = Field(ge=0)


class DetalleVentaResponse(DetalleVentaBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    venta_id: str
    producto_nombre: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# ── Venta ──

class VentaCreate(BaseModel):
    metodo_pago: MetodoPago
    observacion: Optional[str] = None
    detalles: list[DetalleVentaBase]


class VentaResumen(BaseModel):
    """Resumen de venta sin detalles (para listados)."""
    model_config = ConfigDict(from_attributes=True)
    id: str
    fecha_hora: datetime
    total: Decimal
    metodo_pago: MetodoPago
    estado: EstadoVenta
    observacion: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class VentaListResponse(BaseModel):
    items: list[VentaResumen]
    total: int
    page: int
    per_page: int
    total_pages: int


class VentaResponse(VentaResumen):
    detalles: list[DetalleVentaResponse]
