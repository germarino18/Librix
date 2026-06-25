"""Caja — Pydantic schemas."""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.features.caja.models import EstadoCaja


class CajaCreate(BaseModel):
    monto_inicial: Decimal = Decimal("0")
    observacion: Optional[str] = None


class CajaCierre(BaseModel):
    monto_final: Decimal
    total_efectivo: Decimal = Decimal("0")
    total_transferencia: Decimal = Decimal("0")
    total_qr: Decimal = Decimal("0")
    total_servicios: Decimal = Decimal("0")
    observacion: Optional[str] = None


class CajaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    fecha: date
    monto_inicial: Decimal
    monto_final: Optional[Decimal] = None
    estado: EstadoCaja
    total_efectivo: Decimal
    total_transferencia: Decimal
    total_qr: Decimal
    total_servicios: Decimal
    observacion: Optional[str] = None
    created_at: datetime
    updated_at: datetime
