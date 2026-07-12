"""Insumos — database queries."""
from datetime import datetime, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.insumos.models import InsumoServicio, MovimientoInsumo


class InsumoRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_all(self) -> list[InsumoServicio]:
        result = await self.session.execute(
            select(InsumoServicio).order_by(InsumoServicio.nombre.asc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, id: str) -> InsumoServicio | None:
        return await self.session.get(InsumoServicio, id)

    async def create(self, data: dict) -> InsumoServicio:
        insumo = InsumoServicio(**data)
        self.session.add(insumo)
        await self.session.flush()
        return insumo

    async def update(self, id: str, data: dict) -> InsumoServicio | None:
        insumo = await self.session.get(InsumoServicio, id)
        if not insumo:
            return None
        for key, value in data.items():
            setattr(insumo, key, value)
        await self.session.flush()
        return insumo

    async def delete(self, id: str) -> bool:
        insumo = await self.session.get(InsumoServicio, id)
        if not insumo:
            return False
        await self.session.delete(insumo)
        await self.session.flush()
        return True


class MovimientoRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, data: dict) -> MovimientoInsumo:
        movimiento = MovimientoInsumo(**data)
        self.session.add(movimiento)
        await self.session.flush()
        return movimiento

    async def list_by_insumo(self, insumo_id: str) -> list[MovimientoInsumo]:
        result = await self.session.execute(
            select(MovimientoInsumo)
            .where(MovimientoInsumo.insumo_id == insumo_id)
            .order_by(MovimientoInsumo.fecha_hora.desc())
        )
        return list(result.scalars().all())
