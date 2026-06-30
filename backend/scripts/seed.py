"""Seed script — inserts initial test data for development.

Usage:
    cd backend
    python scripts/seed.py
"""

import asyncio
import logging
import sys
import uuid
from datetime import date
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import async_session_factory
from app.features.productos.models import Categoria, Producto
from app.features.insumos.models import InsumoServicio, MovimientoInsumo, TipoMovInsumo
from app.features.ventas.models import DetalleVenta, Venta, EstadoVenta, MetodoPago
from app.features.stock.models import MovimientoStock, TipoMovimiento
from app.features.caja.models import Caja, EstadoCaja
from app.features.servicios.models import RegistroServicio, TipoServicio

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


async def seed():
    logger.info("Starting seed...")

    async with async_session_factory() as session:
        def new_id():
            return str(uuid.uuid4())

        cat_fotocopias = Categoria(id=new_id(), nombre="Fotocopias")
        cat_plastificados = Categoria(id=new_id(), nombre="Plastificados")
        cat_souvenirs = Categoria(id=new_id(), nombre="Souvenirs")
        session.add_all([cat_fotocopias, cat_plastificados, cat_souvenirs])
        await session.flush()
        logger.info("Created 3 categories")

        def calc_precio(precio_compra: Decimal, porcentaje: Decimal = Decimal("30")) -> Decimal:
            return (precio_compra * (Decimal("1") + porcentaje / Decimal("100"))).quantize(Decimal("0.01"))

        prod_byn = Producto(
            id=new_id(),
            nombre="Fotocopia ByN",
            precio_compra=Decimal("0.50"),
            precio_venta=calc_precio(Decimal("0.50")),
            porcentaje_ganancia=Decimal("30"),
            stock_actual=Decimal("500"),
            stock_minimo=Decimal("100"),
            unidad="unidad",
            activo=True,
            categoria_id=cat_fotocopias.id,
        )
        prod_color = Producto(
            id=new_id(),
            nombre="Fotocopia Color",
            precio_compra=Decimal("1.00"),
            precio_venta=calc_precio(Decimal("1.00")),
            porcentaje_ganancia=Decimal("30"),
            stock_actual=Decimal("300"),
            stock_minimo=Decimal("50"),
            unidad="unidad",
            activo=True,
            categoria_id=cat_fotocopias.id,
        )
        prod_plast = Producto(
            id=new_id(),
            nombre="Plastificado A4",
            precio_compra=Decimal("3.00"),
            precio_venta=calc_precio(Decimal("3.00"), Decimal("50")),
            porcentaje_ganancia=Decimal("50"),
            stock_actual=Decimal("100"),
            stock_minimo=Decimal("20"),
            unidad="unidad",
            activo=True,
            categoria_id=cat_plastificados.id,
        )
        prod_llavero = Producto(
            id=new_id(),
            nombre="Llavero Personalizado",
            precio_compra=Decimal("2.00"),
            precio_venta=calc_precio(Decimal("2.00"), Decimal("75")),
            porcentaje_ganancia=Decimal("75"),
            stock_actual=Decimal("50"),
            stock_minimo=Decimal("10"),
            unidad="unidad",
            activo=True,
            categoria_id=cat_souvenirs.id,
        )
        session.add_all([prod_byn, prod_color, prod_plast, prod_llavero])
        await session.flush()
        logger.info("Created 4 products")

        ins_papel = InsumoServicio(
            id=new_id(),
            nombre="Papel A4 80g",
            stock_actual=Decimal("10"),
            unidad="resma",
            costo_unitario=Decimal("500.00"),
            stock_minimo=Decimal("2"),
            paginas_por_unidad=500,
        )
        ins_toner = InsumoServicio(
            id=new_id(),
            nombre="Toner Negro",
            stock_actual=Decimal("5"),
            unidad="unidad",
            costo_unitario=Decimal("800.00"),
            stock_minimo=Decimal("1"),
            paginas_por_unidad=None,
        )
        ins_filamento = InsumoServicio(
            id=new_id(),
            nombre="Filamento PLA 1kg",
            stock_actual=Decimal("3"),
            unidad="kg",
            costo_unitario=Decimal("1200.00"),
            stock_minimo=Decimal("1"),
            paginas_por_unidad=None,
        )
        session.add_all([ins_papel, ins_toner, ins_filamento])
        await session.flush()
        logger.info("Created 3 insumos")

        mov_ins1 = MovimientoInsumo(
            id=new_id(),
            insumo_id=ins_papel.id,
            tipo=TipoMovInsumo.INGRESO,
            cantidad=Decimal("10"),
            observacion="Stock inicial",
        )
        mov_ins2 = MovimientoInsumo(
            id=new_id(),
            insumo_id=ins_toner.id,
            tipo=TipoMovInsumo.INGRESO,
            cantidad=Decimal("5"),
            observacion="Stock inicial",
        )
        mov_ins3 = MovimientoInsumo(
            id=new_id(),
            insumo_id=ins_filamento.id,
            tipo=TipoMovInsumo.INGRESO,
            cantidad=Decimal("3"),
            observacion="Stock inicial",
        )
        session.add_all([mov_ins1, mov_ins2, mov_ins3])
        await session.flush()
        logger.info("Created 3 movimientos de insumo")

        venta = Venta(id=new_id(), total=Decimal("12.00"), metodo_pago=MetodoPago.EFECTIVO, estado=EstadoVenta.COMPLETADA)
        session.add(venta)
        await session.flush()

        det1 = DetalleVenta(
            id=new_id(),
            venta_id=venta.id,
            producto_id=prod_byn.id,
            cantidad=Decimal("10"),
            precio_unitario=Decimal("1.00"),
            subtotal=Decimal("10.00"),
        )
        det2 = DetalleVenta(
            id=new_id(),
            venta_id=venta.id,
            producto_id=prod_color.id,
            cantidad=Decimal("2"),
            precio_unitario=Decimal("1.00"),
            subtotal=Decimal("2.00"),
        )
        session.add_all([det1, det2])
        await session.flush()
        logger.info("Created 1 venta with 2 detalles")

        mov_stock1 = MovimientoStock(
            id=new_id(),
            producto_id=prod_byn.id,
            tipo=TipoMovimiento.VENTA,
            cantidad=Decimal("-10"),
            observacion=f"Venta #{venta.id[:8]}",
        )
        mov_stock2 = MovimientoStock(
            id=new_id(),
            producto_id=prod_color.id,
            tipo=TipoMovimiento.VENTA,
            cantidad=Decimal("-2"),
            observacion=f"Venta #{venta.id[:8]}",
        )
        session.add_all([mov_stock1, mov_stock2])
        await session.flush()
        logger.info("Created 2 movimientos de stock")

        caja = Caja(
            id=new_id(),
            fecha=date.today(),
            monto_inicial=Decimal("1000.00"),
            monto_final=None,
            estado=EstadoCaja.ABIERTA,
            total_efectivo=Decimal("0"),
            total_transferencia=Decimal("0"),
            total_qr=Decimal("0"),
            total_servicios=Decimal("0"),
            observacion="Apertura del dia",
        )
        session.add(caja)
        await session.flush()
        logger.info("Created 1 caja")

        servicio = RegistroServicio(
            id=new_id(),
            fecha=date.today(),
            tipo=TipoServicio.FOCOCOPIA,
            descripcion="Fotocopias ByN varias",
            cantidad=Decimal("50"),
            ingreso_total=Decimal("50.00"),
            costo_insumos=Decimal("25.00"),
            ganancia=Decimal("25.00"),
        )
        session.add(servicio)
        await session.flush()
        logger.info("Created 1 registro de servicio")

        await session.commit()
        logger.info("Seed completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
