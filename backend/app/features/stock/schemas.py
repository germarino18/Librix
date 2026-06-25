"""Stock — Pydantic schemas."""
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.features.stock.models import TipoMovimiento


class MovimientoStockCreate(BaseModel):
    producto_id: str
    tipo: TipoMovimiento
    cantidad: Decimal
    observacion: Optional[str] = None


class MovimientoStockResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    producto_id: str
    tipo: TipoMovimiento
    cantidad: Decimal
    fecha_hora: datetime
    observacion: Optional[str] = None
    created_at: datetime
    updated_at: datetime
