"""Servicios — database queries."""
from datetime import date
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.servicios.models import RegistroServicio, TipoServicio


class ServicioRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_all(
        self,
        fecha: Optional[date] = None,
        tipo: Optional[TipoServicio] = None,
    ) -> list[RegistroServicio]:
        stmt = select(RegistroServicio)
        if fecha is not None:
            stmt = stmt.where(RegistroServicio.fecha == fecha)
        if tipo is not None:
            stmt = stmt.where(RegistroServicio.tipo == tipo)
        stmt = stmt.order_by(RegistroServicio.fecha.desc(), RegistroServicio.created_at.desc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, id: str) -> RegistroServicio | None:
        return await self.session.get(RegistroServicio, id)

    async def create(self, data: dict) -> RegistroServicio:
        servicio = RegistroServicio(**data)
        self.session.add(servicio)
        await self.session.flush()
        return servicio

    async def delete(self, id: str) -> bool:
        servicio = await self.session.get(RegistroServicio, id)
        if not servicio:
            return False
        await self.session.delete(servicio)
        await self.session.flush()
        return True
