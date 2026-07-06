"""make porcentaje_ganancia nullable (no default)

Revision ID: 0004
Revises: 0003
Create Date: 2026-06-30
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "productos",
        "porcentaje_ganancia",
        nullable=True,
        server_default=None,
        type_=sa.Numeric(5, 2),
    )


def downgrade() -> None:
    op.alter_column(
        "productos",
        "porcentaje_ganancia",
        nullable=False,
        server_default="30.00",
        type_=sa.Numeric(5, 2),
    )
