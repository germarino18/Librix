"""Productos — business logic."""
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.features.productos.repository import (
    CategoriaRepository,
    ProductoRepository,
)


def _calcular_precio_venta(precio_compra: Decimal, porcentaje_ganancia: Decimal) -> Decimal:
    """Calcula precio_venta = precio_compra * (1 + porcentaje_ganancia / 100)."""
    return (precio_compra * (Decimal("1") + porcentaje_ganancia / Decimal("100"))).quantize(Decimal("0.01"))


class CategoriaService:
    def __init__(self, session: AsyncSession):
        self.repo = CategoriaRepository(session)

    async def list(self) -> list[dict]:
        categorias = await self.repo.list()
        return [self._to_dict(c) for c in categorias]

    async def get_by_id(self, id: str) -> dict | None:
        categoria = await self.repo.get_by_id(id)
        if not categoria:
            return None
        return self._to_dict(categoria)

    async def create(self, data: dict) -> dict:
        existing = await self.repo.get_by_nombre(data["nombre"])
        if existing:
            raise ValueError("Ya existe una categoría con ese nombre")
        categoria = await self.repo.create(data)
        return self._to_dict(categoria)

    async def update(self, id: str, data: dict) -> dict | None:
        categoria = await self.repo.get_by_id(id)
        if not categoria:
            return None
        if "nombre" in data and data["nombre"]:
            existing = await self.repo.get_by_nombre(data["nombre"])
            if existing and existing.id != id:
                raise ValueError("Ya existe una categoría con ese nombre")
            categoria.nombre = data["nombre"]
        categoria = await self.repo.update(categoria, {"nombre": categoria.nombre})
        return self._to_dict(categoria)

    async def delete(self, id: str) -> bool:
        categoria = await self.repo.get_by_id(id)
        if not categoria:
            return False
        product_count = await self.repo.count_products(id)
        if product_count > 0:
            raise ValueError(
                "No se puede eliminar la categoría porque tiene productos asociados"
            )
        await self.repo.delete(categoria)
        return True

    def _to_dict(self, categoria) -> dict:
        return {
            "id": categoria.id,
            "nombre": categoria.nombre,
            "created_at": categoria.created_at,
            "updated_at": categoria.updated_at,
        }


class ProductoService:
    def __init__(self, session: AsyncSession):
        self.repo = ProductoRepository(session)
        self.cat_repo = CategoriaRepository(session)

    async def list(
        self,
        page: int = 1,
        per_page: int = 20,
        categoria_id: str | None = None,
        search: str | None = None,
        include_inactivos: bool = False,
    ) -> dict:
        items, total = await self.repo.list(
            page=page,
            per_page=per_page,
            categoria_id=categoria_id,
            search=search,
            include_inactivos=include_inactivos,
        )
        total_pages = max(1, (total + per_page - 1) // per_page) if total > 0 else 1
        return {
            "items": [self._to_response(p) for p in items],
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
        }

    async def get_by_id(self, id: str) -> dict | None:
        producto = await self.repo.get_by_id(id)
        if not producto:
            return None
        return self._to_response(producto)

    async def create(self, data: dict) -> dict:
        if data.get("categoria_id"):
            categoria = await self.cat_repo.get_by_id(data["categoria_id"])
            if not categoria:
                raise ValueError("La categoría especificada no existe")
        # Auto-calcular precio_venta
        precio_compra = data.get("precio_compra", Decimal("0"))
        porcentaje = data.get("porcentaje_ganancia", Decimal("30.00"))
        data["precio_venta"] = _calcular_precio_venta(precio_compra, porcentaje)
        producto = await self.repo.create(data)
        return self._to_response(producto)

    async def update(self, id: str, data: dict) -> dict | None:
        if data.get("categoria_id"):
            categoria = await self.cat_repo.get_by_id(data["categoria_id"])
            if not categoria:
                raise ValueError("La categoría especificada no existe")
        # Si se actualiza precio_compra o porcentaje_ganancia, recalcular precio_venta
        if "precio_compra" in data or "porcentaje_ganancia" in data:
            producto_actual = await self.repo.get_by_id(id)
            if producto_actual:
                precio_compra = data.get("precio_compra", producto_actual.precio_compra)
                porcentaje = data.get("porcentaje_ganancia", producto_actual.porcentaje_ganancia)
                data["precio_venta"] = _calcular_precio_venta(precio_compra, porcentaje)
        producto = await self.repo.update(id, data)
        if not producto:
            return None
        return self._to_response(producto)

    async def toggle_activo(self, id: str) -> dict | None:
        producto = await self.repo.toggle_activo(id)
        if not producto:
            return None
        return self._to_response(producto)

    def _to_response(self, producto) -> dict:
        return {
            "id": producto.id,
            "nombre": producto.nombre,
            "precio_compra": producto.precio_compra,
            "precio_venta": producto.precio_venta,
            "porcentaje_ganancia": producto.porcentaje_ganancia,
            "stock_actual": producto.stock_actual,
            "stock_minimo": producto.stock_minimo,
            "unidad": producto.unidad,
            "activo": producto.activo,
            "categoria_id": producto.categoria_id,
            "categoria_nombre": producto.categoria.nombre if producto.categoria else None,
            "stock_bajo": producto.stock_actual < producto.stock_minimo,
            "created_at": producto.created_at,
            "updated_at": producto.updated_at,
        }
