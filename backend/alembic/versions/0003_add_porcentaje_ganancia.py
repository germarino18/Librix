"""add porcentaje_ganancia to productos

Revision ID: 0003
Revises: 0002
Create Date: 2026-06-29
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "productos",
        sa.Column("porcentaje_ganancia", sa.Numeric(5, 2), server_default="30.00", nullable=False),
    )
    # Update existing rows: set precio_venta based on precio_compra * 1.3 if precio_venta is 0
    op.execute(
        "UPDATE productos SET precio_venta = precio_compra * 1.3 WHERE precio_venta = 0 AND precio_compra > 0"
    )


def downgrade() -> None:
    op.drop_column("productos", "porcentaje_ganancia")
