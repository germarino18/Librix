"""Caja — database queries."""
from datetime import date
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.caja.models import Caja, EstadoCaja


class CajaRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_abierta_hoy(self) -> Caja | None:
        hoy = date.today()
        stmt = select(Caja).where(
            Caja.fecha == hoy,
            Caja.estado == EstadoCaja.ABIERTA,
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_fecha(self, fecha: date) -> Caja | None:
        stmt = (
            select(Caja)
            .where(Caja.fecha == fecha)
            .order_by(Caja.created_at.desc())
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_id(self, id: str) -> Caja | None:
        return await self.session.get(Caja, id)

    async def create(self, data: dict) -> Caja:
        caja = Caja(**data)
        self.session.add(caja)
        await self.session.flush()
        return caja

    async def update(self, id: str, data: dict) -> Caja | None:
        caja = await self.get_by_id(id)
        if not caja:
            return None
        for key, value in data.items():
            setattr(caja, key, value)
        await self.session.flush()
        return caja

    async def list_historial(
        self, skip: int = 0, limit: int = 10
    ) -> tuple[list[Caja], int]:
        count_stmt = select(func.count()).select_from(Caja).where(
            Caja.estado == EstadoCaja.CERRADA
        )
        total = (await self.session.execute(count_stmt)).scalar() or 0

        stmt = (
            select(Caja)
            .where(Caja.estado == EstadoCaja.CERRADA)
            .order_by(Caja.fecha.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())
        return items, total
