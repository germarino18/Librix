"""Seed script for Librix — populates the database with initial data.

Usage:
    cd backend && python -m seeds.seed
"""
import asyncio
import sys
import uuid
from decimal import Decimal

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from app.core.config import settings

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _uid() -> str:
    return str(uuid.uuid4())


def _pct(compra: float, venta: float) -> Decimal:
    return Decimal(str(round(((venta - compra) / compra) * 100, 2)))


def _product(
    *,
    nombre: str,
    precio_compra: float,
    precio_venta: float,
    stock_actual: float,
    stock_minimo: float,
    unidad: str = "unidad",
    activo: bool = True,
    categoria_id: str,
) -> dict:
    return {
        "id": _uid(),
        "nombre": nombre,
        "precio_compra": Decimal(str(precio_compra)),
        "precio_venta": Decimal(str(precio_venta)),
        "porcentaje_ganancia": _pct(precio_compra, precio_venta),
        "stock_actual": Decimal(str(stock_actual)),
        "stock_minimo": Decimal(str(stock_minimo)),
        "unidad": unidad,
        "activo": activo,
        "categoria_id": categoria_id,
    }


def _insumo(
    *,
    nombre: str,
    stock_actual: float,
    stock_minimo: float,
    costo_unitario: float,
    unidad: str = "unidad",
    paginas_por_unidad: int | None = None,
) -> dict:
    return {
        "id": _uid(),
        "nombre": nombre,
        "stock_actual": Decimal(str(stock_actual)),
        "unidad": unidad,
        "costo_unitario": Decimal(str(costo_unitario)),
        "stock_minimo": Decimal(str(stock_minimo)),
        "paginas_por_unidad": paginas_por_unidad,
    }


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------

CATEGORIAS = [
    {"id": _uid(), "nombre": "Escritura"},
    {"id": _uid(), "nombre": "Papelería"},
    {"id": _uid(), "nombre": "Carpetas y Archivos"},
    {"id": _uid(), "nombre": "Corrección"},
    {"id": _uid(), "nombre": "Adhesivos"},
    {"id": _uid(), "nombre": "Varios"},
]

_CAT = {c["nombre"]: c["id"] for c in CATEGORIAS}

PRODUCTOS: list[dict] = [
    # ── Escritura ──────────────────────────────────────────────────────────
    _product(nombre="Lapicera Bic Azul (punta fina)", precio_compra=350, precio_venta=480, stock_actual=80, stock_minimo=10, categoria_id=_CAT["Escritura"]),
    _product(nombre="Lapicera Bic Negra (punta fina)", precio_compra=350, precio_venta=480, stock_actual=75, stock_minimo=10, categoria_id=_CAT["Escritura"]),
    _product(nombre="Lapicera Bic Roja (punta fina)", precio_compra=350, precio_venta=480, stock_actual=40, stock_minimo=8, categoria_id=_CAT["Escritura"]),
    _product(nombre="Lápiz HB Negro", precio_compra=200, precio_venta=300, stock_actual=90, stock_minimo=10, categoria_id=_CAT["Escritura"]),
    _product(nombre="Lápiz 2B", precio_compra=220, precio_venta=320, stock_actual=60, stock_minimo=8, categoria_id=_CAT["Escritura"]),
    _product(nombre="Lápiz de color (caja x12)", precio_compra=1200, precio_venta=1600, stock_actual=25, stock_minimo=5, categoria_id=_CAT["Escritura"]),
    _product(nombre="Fibra punta fina azul", precio_compra=400, precio_venta=550, stock_actual=45, stock_minimo=8, categoria_id=_CAT["Escritura"]),
    _product(nombre="Marcador permanente negro", precio_compra=350, precio_venta=500, stock_actual=35, stock_minimo=5, categoria_id=_CAT["Escritura"]),
    _product(nombre="Resaltador amarillo", precio_compra=300, precio_venta=420, stock_actual=50, stock_minimo=8, categoria_id=_CAT["Escritura"]),

    # ── Papelería ──────────────────────────────────────────────────────────
    _product(nombre="Hojas A4 (resma 500 hojas)", precio_compra=2500, precio_venta=3500, stock_actual=30, stock_minimo=5, unidad="resma", categoria_id=_CAT["Papelería"]),
    _product(nombre="Hojas A4 (paquete x100)", precio_compra=600, precio_venta=850, stock_actual=40, stock_minimo=8, unidad="paquete", categoria_id=_CAT["Papelería"]),
    _product(nombre="Hojas A4 (por unidad)", precio_compra=8, precio_venta=15, stock_actual=200, stock_minimo=10, categoria_id=_CAT["Papelería"]),
    _product(nombre="Cuaderno universitario A5 (rayado)", precio_compra=900, precio_venta=1300, stock_actual=35, stock_minimo=5, categoria_id=_CAT["Papelería"]),
    _product(nombre="Cuaderno A4 espiral (cuadriculado)", precio_compra=1400, precio_venta=1900, stock_actual=25, stock_minimo=5, categoria_id=_CAT["Papelería"]),
    _product(nombre="Block de hojas cuadriculadas A4", precio_compra=700, precio_venta=1000, stock_actual=30, stock_minimo=5, categoria_id=_CAT["Papelería"]),
    _product(nombre="Carpeta A4 con 3 anillos (negra)", precio_compra=1800, precio_venta=2500, stock_actual=20, stock_minimo=3, categoria_id=_CAT["Papelería"]),
    _product(nombre="Carpeta de cartón A4 con elástico", precio_compra=500, precio_venta=750, stock_actual=40, stock_minimo=5, categoria_id=_CAT["Papelería"]),
    _product(nombre="Folio/funda plástica (paquete x10)", precio_compra=400, precio_venta=600, stock_actual=50, stock_minimo=5, unidad="paquete", categoria_id=_CAT["Papelería"]),

    # ── Carpetas y Archivos ────────────────────────────────────────────────
    _product(nombre="Carpetas colgantes (paquete x5)", precio_compra=600, precio_venta=900, stock_actual=30, stock_minimo=5, unidad="paquete", categoria_id=_CAT["Carpetas y Archivos"]),
    _product(nombre="Separadores de hojas (paquete x12)", precio_compra=350, precio_venta=500, stock_actual=35, stock_minimo=5, unidad="paquete", categoria_id=_CAT["Carpetas y Archivos"]),
    _product(nombre="Foja archivadora A4 (negra)", precio_compra=2500, precio_venta=3400, stock_actual=15, stock_minimo=3, categoria_id=_CAT["Carpetas y Archivos"]),
    _product(nombre="Bolsas de nylon con manija (paquete x50)", precio_compra=400, precio_venta=600, stock_actual=40, stock_minimo=5, unidad="paquete", categoria_id=_CAT["Carpetas y Archivos"]),
    _product(nombre="Caja archivadora + tapa", precio_compra=1500, precio_venta=2100, stock_actual=20, stock_minimo=3, categoria_id=_CAT["Carpetas y Archivos"]),

    # ── Corrección ─────────────────────────────────────────────────────────
    _product(nombre="Goma de borrar (Milan)", precio_compra=180, precio_venta=280, stock_actual=60, stock_minimo=8, categoria_id=_CAT["Corrección"]),
    _product(nombre="Correcto líquido (lapicera)", precio_compra=350, precio_venta=500, stock_actual=40, stock_minimo=5, categoria_id=_CAT["Corrección"]),
    _product(nombre="Cinta correctora blanca", precio_compra=400, precio_venta=550, stock_actual=35, stock_minimo=5, categoria_id=_CAT["Corrección"]),
    _product(nombre="Corrector líquido (frasco)", precio_compra=250, precio_venta=380, stock_actual=30, stock_minimo=5, categoria_id=_CAT["Corrección"]),
    _product(nombre="Bolígrafo de gel borrable azul", precio_compra=450, precio_venta=620, stock_actual=25, stock_minimo=3, categoria_id=_CAT["Corrección"]),

    # ── Adhesivos ──────────────────────────────────────────────────────────
    _product(nombre="Cinta adhesiva transparente (chica)", precio_compra=180, precio_venta=280, stock_actual=60, stock_minimo=8, categoria_id=_CAT["Adhesivos"]),
    _product(nombre="Cinta adhesiva de embalar (grande)", precio_compra=500, precio_venta=700, stock_actual=30, stock_minimo=5, categoria_id=_CAT["Adhesivos"]),
    _product(nombre="Pegamento en barra (tamaño mediano)", precio_compra=250, precio_venta=380, stock_actual=45, stock_minimo=8, categoria_id=_CAT["Adhesivos"]),
    _product(nombre="Pegamento líquido (frasco 50ml)", precio_compra=300, precio_venta=430, stock_actual=35, stock_minimo=5, categoria_id=_CAT["Adhesivos"]),
    _product(nombre="Notas adhesivas Post-it (paquete)", precio_compra=350, precio_venta=500, stock_actual=50, stock_minimo=5, categoria_id=_CAT["Adhesivos"]),

    # ── Varios ─────────────────────────────────────────────────────────────
    _product(nombre="Tijera de escritorio", precio_compra=500, precio_venta=700, stock_actual=30, stock_minimo=5, categoria_id=_CAT["Varios"]),
    _product(nombre="Regla de 30 cm (plástica)", precio_compra=150, precio_venta=250, stock_actual=55, stock_minimo=5, categoria_id=_CAT["Varios"]),
    _product(nombre="Sacapuntas metálico", precio_compra=200, precio_venta=320, stock_actual=40, stock_minimo=5, categoria_id=_CAT["Varios"]),
    _product(nombre="Clip metálico (caja x50)", precio_compra=120, precio_venta=200, stock_actual=70, stock_minimo=8, unidad="caja", categoria_id=_CAT["Varios"]),
    _product(nombre="Broches mariposa (caja x40)", precio_compra=150, precio_venta=250, stock_actual=50, stock_minimo=5, unidad="caja", categoria_id=_CAT["Varios"]),
    _product(nombre="Ganchito (caja x100)", precio_compra=100, precio_venta=180, stock_actual=80, stock_minimo=8, unidad="caja", categoria_id=_CAT["Varios"]),
]

INSUMOS: list[dict] = [
    _insumo(nombre="Resma de papel A4 (500 hojas)", stock_actual=15, stock_minimo=3, costo_unitario=2200, unidad="resma", paginas_por_unidad=500),
    _insumo(nombre="Cartucho de tóner negro", stock_actual=5, stock_minimo=2, costo_unitario=8500, unidad="cartucho"),
    _insumo(nombre="Cartucho de tóner color", stock_actual=3, stock_minimo=1, costo_unitario=12000, unidad="cartucho"),
]


# ---------------------------------------------------------------------------
# Seed runner
# ---------------------------------------------------------------------------

# Tables in REVERSE dependency order for cleanup
_TABLES = [
    "movimientos_insumo",
    "registros_servicio",
    "movimientos_stock",
    "detalles_venta",
    "ventas",
    "insumos_servicio",
    "productos",
    "categorias",
]


async def seed() -> None:
    engine = create_async_engine(settings.DATABASE_URL, echo=False)

    async with AsyncSession(engine) as session:
        # ── 1. Clean existing data ─────────────────────────────────────────
        print("\nLimpiando datos existentes...")
        for table in _TABLES:
            await session.execute(text(f"DELETE FROM {table}"))
            print(f"  [OK] {table}")
        await session.commit()

        # ── 2. Insert categorías ───────────────────────────────────────────
        print("\nInsertando categorias...")
        for cat in CATEGORIAS:
            await session.execute(
                text("INSERT INTO categorias (id, nombre, created_at, updated_at) VALUES (:id, :nombre, NOW(), NOW())"),
                cat,
            )
        print(f"  [OK] {len(CATEGORIAS)} categorias insertadas")

        # ── 3. Insert productos ────────────────────────────────────────────
        print("\nInsertando productos...")
        for prod in PRODUCTOS:
            await session.execute(
                text(
                    "INSERT INTO productos "
                    "(id, nombre, precio_compra, precio_venta, porcentaje_ganancia, "
                    "stock_actual, stock_minimo, unidad, activo, categoria_id, created_at, updated_at) "
                    "VALUES (:id, :nombre, :precio_compra, :precio_venta, :porcentaje_ganancia, "
                    ":stock_actual, :stock_minimo, :unidad, :activo, :categoria_id, NOW(), NOW())"
                ),
                prod,
            )
        print(f"  [OK] {len(PRODUCTOS)} productos insertados")

        # ── 4. Insert insumos ──────────────────────────────────────────────
        print("\nInsertando insumos de servicio...")
        for ins in INSUMOS:
            await session.execute(
                text(
                    "INSERT INTO insumos_servicio "
                    "(id, nombre, stock_actual, unidad, costo_unitario, stock_minimo, "
                    "paginas_por_unidad, created_at, updated_at) "
                    "VALUES (:id, :nombre, :stock_actual, :unidad, :costo_unitario, :stock_minimo, "
                    ":paginas_por_unidad, NOW(), NOW())"
                ),
                ins,
            )
        print(f"  [OK] {len(INSUMOS)} insumos insertados")

        # ── 5. Commit ──────────────────────────────────────────────────────
        await session.commit()
        print("\n[DONE] Seed completado exitosamente.")

    await engine.dispose()


if __name__ == "__main__":
    try:
        asyncio.run(seed())
    except Exception as exc:
        print(f"\n[ERROR] Error durante el seed: {exc}", file=sys.stderr)
        sys.exit(1)
