"""Insumos — business logic."""
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession

from app.features.insumos.models import TipoMovInsumo
from app.features.insumos.repository import InsumoRepository, MovimientoRepository


class InsumoService:
    def __init__(self, session: AsyncSession):
        self.insumo_repo = InsumoRepository(session)
        self.movimiento_repo = MovimientoRepository(session)
        self.session = session

    async def list_all(self) -> list[dict]:
        insumos = await self.insumo_repo.list_all()
        return [self._to_response(i) for i in insumos]

    async def get_by_id(self, id: str) -> dict | None:
        insumo = await self.insumo_repo.get_by_id(id)
        if not insumo:
            return None
        return self._to_response(insumo)

    async def create(self, data: dict) -> dict:
        insumo = await self.insumo_repo.create(data)
        await self.session.commit()
        await self.session.refresh(insumo)
        return self._to_response(insumo)

    async def update(self, id: str, data: dict) -> dict | None:
        insumo = await self.insumo_repo.update(id, data)
        if not insumo:
            return None
        await self.session.commit()
        await self.session.refresh(insumo)
        return self._to_response(insumo)

    async def delete(self, id: str) -> bool:
        result = await self.insumo_repo.delete(id)
        if result:
            await self.session.commit()
        return result

    async def create_movimiento(self, insumo_id: str, data: dict) -> dict:
        insumo = await self.insumo_repo.get_by_id(insumo_id)
        if not insumo:
            raise ValueError("Insumo no encontrado")

        cantidad = Decimal(str(data["cantidad"]))
        tipo = data["tipo"]

        if tipo == TipoMovInsumo.CONSUMO:
            if insumo.stock_actual < cantidad:
                raise ValueError(
                    f"Stock insuficiente. Stock actual: {insumo.stock_actual}, "
                    f"cantidad solicitada: {cantidad}"
                )
            insumo.stock_actual -= cantidad
        else:
            insumo.stock_actual += cantidad

        movimiento = await self.movimiento_repo.create({
            "insumo_id": insumo_id,
            "tipo": tipo,
            "cantidad": cantidad,
            "observacion": data.get("observacion"),
        })

        await self.session.commit()
        await self.session.refresh(movimiento)
        await self.session.refresh(insumo)

        return self._movimiento_to_response(movimiento)

    async def list_movimientos(self, insumo_id: str) -> list[dict]:
        insumo = await self.insumo_repo.get_by_id(insumo_id)
        if not insumo:
            raise ValueError("Insumo no encontrado")

        movimientos = await self.movimiento_repo.list_by_insumo(insumo_id)
        return [self._movimiento_to_response(m) for m in movimientos]

    def _to_response(self, insumo) -> dict:
        return {
            "id": insumo.id,
            "nombre": insumo.nombre,
            "stock_actual": insumo.stock_actual,
            "unidad": insumo.unidad,
            "costo_unitario": insumo.costo_unitario,
            "stock_minimo": insumo.stock_minimo,
            "paginas_por_unidad": insumo.paginas_por_unidad,
            "stock_bajo": insumo.stock_actual < insumo.stock_minimo,
            "created_at": insumo.created_at.isoformat(),
            "updated_at": insumo.updated_at.isoformat(),
        }

    def _movimiento_to_response(self, m) -> dict:
        return {
            "id": m.id,
            "insumo_id": m.insumo_id,
            "tipo": m.tipo.value,
            "cantidad": m.cantidad,
            "fecha_hora": m.fecha_hora.isoformat(),
            "observacion": m.observacion,
            "created_at": m.created_at.isoformat(),
            "updated_at": m.updated_at.isoformat(),
        }
