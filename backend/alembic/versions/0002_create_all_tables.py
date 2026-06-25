"""create all tables

Revision ID: 0002
Revises: None
Create Date: 2026-06-25
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enums se crean automáticamente al crear las tablas que los usan

    # ── Categorias ──
    op.create_table(
        "categorias",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("nombre", sa.String(100), unique=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ── Productos ──
    op.create_table(
        "productos",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("nombre", sa.String(200), nullable=False),
        sa.Column("precio_compra", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("precio_venta", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("stock_actual", sa.Numeric(10, 2), server_default="0", nullable=False),
        sa.Column("stock_minimo", sa.Numeric(10, 2), server_default="0", nullable=False),
        sa.Column("unidad", sa.String(50), server_default="unidad", nullable=False),
        sa.Column("activo", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("categoria_id", sa.String(36), sa.ForeignKey("categorias.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_productos_categoria_id"), "productos", ["categoria_id"])
    op.create_index(op.f("ix_productos_activo"), "productos", ["activo"])
    op.create_index(op.f("ix_productos_nombre"), "productos", ["nombre"])

    # ── Ventas ──
    op.create_table(
        "ventas",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("fecha_hora", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("total", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("metodo_pago", sa.Enum("efectivo", "transferencia", "qr_mercadopago", name="metodopago"), nullable=False),
        sa.Column("estado", sa.Enum("completada", "cancelada", name="estadoventa"), server_default="completada", nullable=False),
        sa.Column("observacion", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ── Detalles Venta ──
    op.create_table(
        "detalles_venta",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("venta_id", sa.String(36), sa.ForeignKey("ventas.id"), nullable=False),
        sa.Column("producto_id", sa.String(36), sa.ForeignKey("productos.id"), nullable=False),
        sa.Column("cantidad", sa.Numeric(10, 2), nullable=False),
        sa.Column("precio_unitario", sa.Numeric(12, 2), nullable=False),
        sa.Column("subtotal", sa.Numeric(12, 2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_detalles_venta_venta_id"), "detalles_venta", ["venta_id"])
    op.create_index(op.f("ix_detalles_venta_producto_id"), "detalles_venta", ["producto_id"])

    # ── Movimientos Stock ──
    op.create_table(
        "movimientos_stock",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("producto_id", sa.String(36), sa.ForeignKey("productos.id"), nullable=False),
        sa.Column("tipo", sa.Enum("ingreso", "venta", "ajuste", name="tipomovimiento"), nullable=False),
        sa.Column("cantidad", sa.Numeric(10, 2), nullable=False),
        sa.Column("fecha_hora", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("observacion", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_movimientos_stock_producto_id"), "movimientos_stock", ["producto_id"])
    op.create_index(op.f("ix_movimientos_stock_tipo"), "movimientos_stock", ["tipo"])

    # ── Cajas ──
    op.create_table(
        "cajas",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("monto_inicial", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("monto_final", sa.Numeric(12, 2), nullable=True),
        sa.Column("estado", sa.Enum("abierta", "cerrada", name="estadocaja"), server_default="abierta", nullable=False),
        sa.Column("total_efectivo", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("total_transferencia", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("total_qr", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("total_servicios", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("observacion", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_cajas_fecha"), "cajas", ["fecha"])

    # ── Insumos Servicio ──
    op.create_table(
        "insumos_servicio",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("nombre", sa.String(200), nullable=False),
        sa.Column("stock_actual", sa.Numeric(10, 2), server_default="0", nullable=False),
        sa.Column("unidad", sa.String(50), server_default="unidad", nullable=False),
        sa.Column("costo_unitario", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("stock_minimo", sa.Numeric(10, 2), server_default="0", nullable=False),
        sa.Column("paginas_por_unidad", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # ── Movimientos Insumo ──
    op.create_table(
        "movimientos_insumo",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("insumo_id", sa.String(36), sa.ForeignKey("insumos_servicio.id"), nullable=False),
        sa.Column("tipo", sa.Enum("ingreso", "consumo", name="tipomovinsumo"), nullable=False),
        sa.Column("cantidad", sa.Numeric(10, 2), nullable=False),
        sa.Column("fecha_hora", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("observacion", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_movimientos_insumo_insumo_id"), "movimientos_insumo", ["insumo_id"])

    # ── Registros Servicio ──
    op.create_table(
        "registros_servicio",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("tipo", sa.Enum("fotocopia", "plastificado", "souvenir", "otro", name="tiposervicio"), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=False),
        sa.Column("cantidad", sa.Numeric(10, 2), server_default="1", nullable=False),
        sa.Column("ingreso_total", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("costo_insumos", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("ganancia", sa.Numeric(12, 2), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_registros_servicio_fecha"), "registros_servicio", ["fecha"])
    op.create_index(op.f("ix_registros_servicio_tipo"), "registros_servicio", ["tipo"])


def downgrade() -> None:
    op.drop_table("registros_servicio")
    op.drop_table("movimientos_insumo")
    op.drop_table("insumos_servicio")
    op.drop_table("cajas")
    op.drop_table("movimientos_stock")
    op.drop_table("detalles_venta")
    op.drop_table("ventas")
    op.drop_table("productos")
    op.drop_table("categorias")

    sa.Enum(name="tiposervicio").drop(op.get_bind())
    sa.Enum(name="tipomovinsumo").drop(op.get_bind())
    sa.Enum(name="estadocaja").drop(op.get_bind())
    sa.Enum(name="tipomovimiento").drop(op.get_bind())
    sa.Enum(name="estadoventa").drop(op.get_bind())
    sa.Enum(name="metodopago").drop(op.get_bind())
