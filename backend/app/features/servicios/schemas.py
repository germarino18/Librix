"""Servicios — Pydantic schemas."""
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.features.servicios.models import TipoServicio


class RegistroServicioCreate(BaseModel):
    fecha: date
    tipo: TipoServicio
    descripcion: str
    cantidad: Decimal = Decimal("1")
    ingreso_total: Decimal = Decimal("0")
    costo_insumos: Decimal = Decimal("0")


class RegistroServicioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    fecha: date
    tipo: TipoServicio
    descripcion: str
    cantidad: Decimal
    ingreso_total: Decimal
    costo_insumos: Decimal
    ganancia: Decimal
    created_at: datetime
    updated_at: datetime


class RegistroServicioFiltros(BaseModel):
    fecha: Optional[date] = None
    tipo: Optional[TipoServicio] = None
