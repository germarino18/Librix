"""Ventas — database queries."""
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.ventas.models import Venta, DetalleVenta


class VentaRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, data: dict) -> Venta:
        venta = Venta(**data)
        self.session.add(venta)
        await self.session.flush()
        return venta

    async def get_by_id(self, id: str) -> Venta | None:
        result = await self.session.execute(
            select(Venta)
            .options(
                selectinload(Venta.detalles).selectinload(DetalleVenta.producto)
            )
            .where(Venta.id == id)
        )
        return result.scalar_one_or_none()

    async def get_producto_by_id(self, producto_id: str):
        from app.features.productos.models import Producto
        return await self.session.get(Producto, producto_id)

    async def list(
        self,
        page: int = 1,
        per_page: int = 20,
    ) -> tuple[list[Venta], int]:
        count_query = select(func.count()).select_from(Venta)
        total_result = await self.session.execute(count_query)
        total = total_result.scalar() or 0

        query = (
            select(Venta)
            .order_by(Venta.fecha_hora.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        result = await self.session.execute(query)
        items = list(result.scalars().all())

        return items, total
