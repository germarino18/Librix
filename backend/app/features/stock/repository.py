"""Stock — database queries."""
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.stock.models import MovimientoStock


class StockRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_movimiento(self, data: dict) -> MovimientoStock:
        movimiento = MovimientoStock(**data)
        self.session.add(movimiento)
        await self.session.flush()
        return movimiento
