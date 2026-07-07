"""Stock — business logic."""
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.features.stock.models import TipoMovimiento
from app.features.stock.repository import StockRepository


class StockService:
    def __init__(self, session: AsyncSession):
        self.repo = StockRepository(session)

    async def create_movimiento(
        self,
        producto_id: str,
        tipo: str,
        cantidad: Decimal | float,
        observacion: str | None = None,
    ) -> dict:
        tipo_enum = TipoMovimiento(tipo)
        cantidad_dec = Decimal(str(cantidad)) if not isinstance(cantidad, Decimal) else cantidad
        movimiento = await self.repo.create_movimiento({
            "producto_id": producto_id,
            "tipo": tipo_enum,
            "cantidad": cantidad_dec,
            "observacion": observacion,
        })
        return {
            "id": movimiento.id,
            "producto_id": movimiento.producto_id,
            "tipo": movimiento.tipo.value,
            "cantidad": movimiento.cantidad,
            "fecha_hora": movimiento.fecha_hora,
            "observacion": movimiento.observacion,
        }

    async def create_movimientos_batch(self, movimientos: list[dict]) -> list[dict]:
        results = []
        for mov in movimientos:
            mov_data = dict(mov)
            mov_data["tipo"] = TipoMovimiento(mov_data["tipo"])
            if not isinstance(mov_data.get("cantidad"), Decimal):
                mov_data["cantidad"] = Decimal(str(mov_data["cantidad"]))
            m = await self.repo.create_movimiento(mov_data)
            results.append({
                "id": m.id,
                "producto_id": m.producto_id,
                "tipo": m.tipo.value,
                "cantidad": m.cantidad,
                "fecha_hora": m.fecha_hora,
                "observacion": m.observacion,
            })
        return results
