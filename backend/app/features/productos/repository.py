"""Productos — database queries."""
from typing import List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.productos.models import Categoria, Producto


class CategoriaRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list(self) -> list[Categoria]:
        result = await self.session.execute(
            select(Categoria).order_by(Categoria.nombre)
        )
        return list(result.scalars().all())

    async def get_by_id(self, id: str) -> Categoria | None:
        return await self.session.get(Categoria, id)

    async def get_by_nombre(self, nombre: str) -> Categoria | None:
        result = await self.session.execute(
            select(Categoria).where(Categoria.nombre == nombre)
        )
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> Categoria:
        categoria = Categoria(**data)
        self.session.add(categoria)
        await self.session.commit()
        await self.session.refresh(categoria)
        return categoria

    async def update(self, categoria: Categoria, data: dict) -> Categoria:
        for key, value in data.items():
            setattr(categoria, key, value)
        await self.session.commit()
        await self.session.refresh(categoria)
        return categoria

    async def delete(self, categoria: Categoria) -> None:
        await self.session.delete(categoria)
        await self.session.commit()

    async def count_products(self, categoria_id: str) -> int:
        result = await self.session.execute(
            select(func.count()).select_from(Producto).where(
                Producto.categoria_id == categoria_id
            )
        )
        return result.scalar() or 0


class ProductoRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list(
        self,
        page: int = 1,
        per_page: int = 20,
        categoria_id: str | None = None,
        search: str | None = None,
        include_inactivos: bool = False,
    ) -> tuple[list[Producto], int]:
        base_query = select(Producto).options(selectinload(Producto.categoria))
        count_query = select(func.count()).select_from(Producto)

        if categoria_id:
            base_query = base_query.where(Producto.categoria_id == categoria_id)
            count_query = count_query.where(Producto.categoria_id == categoria_id)
        if search:
            pattern = f"%{search}%"
            base_query = base_query.where(Producto.nombre.ilike(pattern))
            count_query = count_query.where(Producto.nombre.ilike(pattern))
        if not include_inactivos:
            base_query = base_query.where(Producto.activo == True)
            count_query = count_query.where(Producto.activo == True)

        total_result = await self.session.execute(count_query)
        total = total_result.scalar() or 0

        base_query = base_query.order_by(Producto.created_at.desc())
        base_query = base_query.offset((page - 1) * per_page).limit(per_page)

        result = await self.session.execute(base_query)
        items = list(result.scalars().all())

        return items, total

    async def get_by_id(self, id: str) -> Producto | None:
        result = await self.session.execute(
            select(Producto)
            .options(selectinload(Producto.categoria))
            .where(Producto.id == id)
        )
        return result.scalar_one_or_none()

    async def create(self, data: dict) -> Producto:
        producto = Producto(**data)
        self.session.add(producto)
        await self.session.commit()
        await self.session.refresh(producto)
        result = await self.session.execute(
            select(Producto)
            .options(selectinload(Producto.categoria))
            .where(Producto.id == producto.id)
        )
        return result.scalar_one()

    async def update(self, id: str, data: dict) -> Producto | None:
        producto = await self.get_by_id(id)
        if not producto:
            return None
        for key, value in data.items():
            setattr(producto, key, value)
        await self.session.commit()
        # Reload with categoria relationship
        result = await self.session.execute(
            select(Producto)
            .options(selectinload(Producto.categoria))
            .where(Producto.id == id)
        )
        return result.scalar_one()

    async def toggle_activo(self, id: str) -> Producto | None:
        producto = await self.get_by_id(id)
        if not producto:
            return None
        producto.activo = not producto.activo
        await self.session.commit()
        result = await self.session.execute(
            select(Producto)
            .options(selectinload(Producto.categoria))
            .where(Producto.id == id)
        )
        return result.scalar_one()

    async def buscar(self, query: str) -> List[Producto]:
        """Lightweight search by name, active only, stock > 0."""
        pattern = f"%{query}%"
        result = await self.session.execute(
            select(Producto)
            .where(Producto.activo == True)
            .where(Producto.stock_actual > 0)
            .where(Producto.nombre.ilike(pattern))
            .order_by(Producto.nombre)
            .limit(20)
        )
        return list(result.scalars().all())
