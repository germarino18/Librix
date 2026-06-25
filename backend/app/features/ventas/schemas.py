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
    created_at: datetime
    updated_at: datetime


# ── Venta ──

class VentaCreate(BaseModel):
    metodo_pago: MetodoPago
    observacion: Optional[str] = None
    detalles: list[DetalleVentaBase]


class VentaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    fecha_hora: datetime
    total: Decimal
    metodo_pago: MetodoPago
    estado: EstadoVenta
    observacion: Optional[str] = None
    detalles: list[DetalleVentaResponse]
    created_at: datetime
    updated_at: datetime
