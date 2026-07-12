"""Servicios — business logic."""
from datetime import date
from decimal import Decimal
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.features.servicios.models import TipoServicio
from app.features.servicios.repository import ServicioRepository

PRECIO_FOTOCOPIA_POR_HOJA = Decimal("50")

PRECIOS_PLASTIFICADO: dict[str, Decimal] = {
    "A4": Decimal("100"),
    "A5": Decimal("80"),
    "10x15": Decimal("50"),
    "tarjeta": Decimal("40"),
}


def calcular_ganancia(ingreso_total: Decimal, costo_insumos: Decimal) -> Decimal:
    return ingreso_total - costo_insumos


def calcular_ingreso_fotocopia(cantidad: Decimal) -> Decimal:
    return cantidad * PRECIO_FOTOCOPIA_POR_HOJA


def calcular_ingreso_plastificado(tipo_frecuente: str, cantidad: Decimal) -> Decimal:
    precio = PRECIOS_PLASTIFICADO.get(tipo_frecuente, Decimal("0"))
    return precio * cantidad


class ServicioService:
    def __init__(self, session: AsyncSession):
        self.repo = ServicioRepository(session)
        self.session = session

    async def list_all(
        self,
        fecha: Optional[date] = None,
        tipo: Optional[TipoServicio] = None,
    ) -> list[dict]:
        servicios = await self.repo.list_all(fecha=fecha, tipo=tipo)
        return [self._to_response(s) for s in servicios]

    async def get_by_id(self, id: str) -> dict | None:
        servicio = await self.repo.get_by_id(id)
        if not servicio:
            return None
        return self._to_response(servicio)

    async def create(self, data: dict) -> dict:
        tipo = data["tipo"]
        cantidad = Decimal(str(data.get("cantidad", 1)))
        ingreso_total = Decimal(str(data.get("ingreso_total", 0)))
        costo_insumos = Decimal(str(data.get("costo_insumos", 0)))

        if tipo == TipoServicio.FOTOCOPIA and ingreso_total == 0:
            ingreso_total = calcular_ingreso_fotocopia(cantidad)

        ganancia = calcular_ganancia(ingreso_total, costo_insumos)

        data["ingreso_total"] = ingreso_total
        data["costo_insumos"] = costo_insumos
        data["ganancia"] = ganancia
        data["cantidad"] = cantidad

        servicio = await self.repo.create(data)
        await self.session.commit()
        await self.session.refresh(servicio)
        return self._to_response(servicio)

    async def delete(self, id: str) -> bool:
        result = await self.repo.delete(id)
        if result:
            await self.session.commit()
        return result

    def _to_response(self, s) -> dict:
        return {
            "id": s.id,
            "fecha": s.fecha.isoformat() if hasattr(s.fecha, "isoformat") else str(s.fecha),
            "tipo": s.tipo.value,
            "descripcion": s.descripcion,
            "cantidad": float(s.cantidad),
            "ingreso_total": float(s.ingreso_total),
            "costo_insumos": float(s.costo_insumos),
            "ganancia": float(s.ganancia),
            "created_at": s.created_at.isoformat(),
            "updated_at": s.updated_at.isoformat(),
        }
