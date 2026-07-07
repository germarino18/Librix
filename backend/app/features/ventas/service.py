"""Ventas — business logic."""
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.features.stock.service import StockService
from app.features.ventas.models import DetalleVenta, EstadoVenta, Venta
from app.features.ventas.repository import VentaRepository


class VentaService:
    def __init__(self, session: AsyncSession):
        self.repo = VentaRepository(session)
        self.stock_service = StockService(session)

    async def create(self, data: dict) -> dict:
        metodo_pago = data["metodo_pago"]
        observacion = data.get("observacion")
        detalles_data = data["detalles"]

        if not detalles_data:
            raise ValueError("La venta debe tener al menos un detalle")

        # Validate products exist and calculate total
        total = Decimal("0")
        detalles_orm = []
        for d in detalles_data:
            producto = await self.repo.get_producto_by_id(d["producto_id"])
            if not producto:
                raise ValueError(f"Producto {d['producto_id']} no encontrado")

            cantidad = Decimal(str(d["cantidad"]))
            precio_unitario = Decimal(str(d["precio_unitario"]))
            subtotal = cantidad * precio_unitario
            total += subtotal

            detalles_orm.append(DetalleVenta(
                producto_id=d["producto_id"],
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                subtotal=subtotal,
            ))

        # Create sale
        venta = await self.repo.create({
            "total": total,
            "metodo_pago": metodo_pago,
            "estado": EstadoVenta.COMPLETADA,
            "observacion": observacion,
        })

        # Associate details with sale
        for det in detalles_orm:
            det.venta_id = venta.id
            self.repo.session.add(det)

        await self.repo.session.flush()

        # Create stock movements for each product
        for d in detalles_data:
            producto = await self.repo.get_producto_by_id(d["producto_id"])
            cantidad = Decimal(str(d["cantidad"]))
            await self.stock_service.create_movimiento(
                producto_id=d["producto_id"],
                tipo="venta",
                cantidad=-cantidad,
                observacion=f"Venta {venta.id}",
            )
            # Decrement stock
            producto.stock_actual -= cantidad

        await self.repo.session.commit()
        await self.repo.session.refresh(venta)

        # Reload with detalles
        result = await self.repo.session.execute(
            select(Venta)
            .options(selectinload(Venta.detalles))
            .where(Venta.id == venta.id)
        )
        venta = result.scalar_one()

        return self._to_response(venta)

    async def list(self, page: int = 1, per_page: int = 20) -> dict:
        items, total = await self.repo.list(page=page, per_page=per_page)
        total_pages = max(1, (total + per_page - 1) // per_page) if total > 0 else 1
        return {
            "items": [self._to_resumen(v) for v in items],
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
        }

    async def get_by_id(self, id: str) -> dict | None:
        venta = await self.repo.get_by_id(id)
        if not venta:
            return None
        return self._to_response(venta)

    def _to_resumen(self, venta) -> dict:
        return {
            "id": venta.id,
            "fecha_hora": venta.fecha_hora.isoformat(),
            "total": venta.total,
            "metodo_pago": venta.metodo_pago.value,
            "estado": venta.estado.value,
            "observacion": venta.observacion,
            "created_at": venta.created_at.isoformat(),
            "updated_at": venta.updated_at.isoformat(),
        }

    def _to_response(self, venta) -> dict:
        return {
            "id": venta.id,
            "fecha_hora": venta.fecha_hora.isoformat(),
            "total": venta.total,
            "metodo_pago": venta.metodo_pago.value,
            "estado": venta.estado.value,
            "observacion": venta.observacion,
            "detalles": [
                {
                    "id": d.id,
                    "venta_id": d.venta_id,
                    "producto_id": d.producto_id,
                    "producto_nombre": d.producto.nombre if d.producto else None,
                    "cantidad": d.cantidad,
                    "precio_unitario": d.precio_unitario,
                    "subtotal": d.subtotal,
                    "created_at": d.created_at.isoformat(),
                    "updated_at": d.updated_at.isoformat(),
                }
                for d in venta.detalles
            ],
            "created_at": venta.created_at.isoformat(),
            "updated_at": venta.updated_at.isoformat(),
        }
