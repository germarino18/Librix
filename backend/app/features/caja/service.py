"""Caja — business logic."""
from datetime import date, datetime
from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy import cast, Date, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.caja.models import Caja, EstadoCaja
from app.features.caja.repository import CajaRepository
from app.features.servicios.models import RegistroServicio
from app.features.ventas.models import EstadoVenta, MetodoPago, Venta


class CajaService:
    def __init__(self, session: AsyncSession):
        self.repo = CajaRepository(session)
        self.session = session

    async def abrir(
        self, monto_inicial: Decimal, observacion: str | None = None
    ) -> Caja:
        existente = await self.repo.get_abierta_hoy()
        if existente:
            raise HTTPException(
                status_code=409,
                detail="Ya existe una caja abierta para el día de hoy",
            )

        data = {
            "fecha": date.today(),
            "monto_inicial": monto_inicial,
            "estado": EstadoCaja.ABIERTA,
            "observacion": observacion,
        }
        caja = await self.repo.create(data)
        await self.session.commit()
        await self.session.refresh(caja)
        return caja

    async def cerrar(self, observacion: str | None = None) -> Caja:
        caja = await self.repo.get_abierta_hoy()
        if not caja:
            raise HTTPException(
                status_code=404,
                detail="No hay caja abierta para el día de hoy",
            )

        hoy = date.today()
        inicio_dia = datetime.combine(hoy, datetime.min.time())
        fin_dia = datetime.combine(hoy, datetime.max.time())

        # Sumar ventas completadas por método de pago (excluir canceladas — RN-10)
        total_efectivo = await self._sum_ventas_por_pago(
            inicio_dia, fin_dia, MetodoPago.EFECTIVO
        )
        total_transferencia = await self._sum_ventas_por_pago(
            inicio_dia, fin_dia, MetodoPago.TRANSFERENCIA
        )
        total_qr = await self._sum_ventas_por_pago(
            inicio_dia, fin_dia, MetodoPago.QR_MERCADOPAGO
        )

        # Sumar ganancia de servicios del día
        total_servicios = await self._sum_servicios_ganancia(hoy)

        monto_final = (
            caja.monto_inicial
            + total_efectivo
            + total_transferencia
            + total_qr
            + total_servicios
        )

        data = {
            "estado": EstadoCaja.CERRADA,
            "monto_final": monto_final,
            "total_efectivo": total_efectivo,
            "total_transferencia": total_transferencia,
            "total_qr": total_qr,
            "total_servicios": total_servicios,
            "observacion": observacion,
        }
        caja = await self.repo.update(caja.id, data)
        assert caja is not None
        await self.session.commit()
        await self.session.refresh(caja)
        return caja

    async def get_actual(self) -> Caja | None:
        hoy = date.today()

        # 1. Priorizar caja abierta con totales en vivo
        caja = await self.repo.get_abierta_hoy()
        if caja:
            inicio_dia = datetime.combine(hoy, datetime.min.time())
            fin_dia = datetime.combine(hoy, datetime.max.time())

            caja.total_efectivo = await self._sum_ventas_por_pago(
                inicio_dia, fin_dia, MetodoPago.EFECTIVO
            )
            caja.total_transferencia = await self._sum_ventas_por_pago(
                inicio_dia, fin_dia, MetodoPago.TRANSFERENCIA
            )
            caja.total_qr = await self._sum_ventas_por_pago(
                inicio_dia, fin_dia, MetodoPago.QR_MERCADOPAGO
            )
            caja.total_servicios = await self._sum_servicios_ganancia(hoy)
            return caja

        # 2. Si no hay abierta, devolver la más reciente (puede estar cerrada)
        caja = await self.repo.get_by_fecha(hoy)
        return caja  # None si no hay caja hoy

    async def get_by_id(self, id: str) -> Caja | None:
        return await self.repo.get_by_id(id)

    async def list_historial(
        self, skip: int = 0, limit: int = 10
    ) -> tuple[list[Caja], int]:
        return await self.repo.list_historial(skip=skip, limit=limit)

    async def _sum_ventas_por_pago(
        self, inicio: datetime, fin: datetime, metodo: MetodoPago
    ) -> Decimal:
        stmt = select(func.coalesce(func.sum(Venta.total), 0)).where(
            Venta.fecha_hora >= inicio,
            Venta.fecha_hora <= fin,
            Venta.metodo_pago == metodo,
            Venta.estado == EstadoVenta.COMPLETADA,
        )
        result = await self.session.execute(stmt)
        return Decimal(str(result.scalar()))

    async def _sum_servicios_ganancia(self, fecha: date) -> Decimal:
        stmt = select(
            func.coalesce(func.sum(RegistroServicio.ganancia), 0)
        ).where(RegistroServicio.fecha == fecha)
        result = await self.session.execute(stmt)
        return Decimal(str(result.scalar()))
