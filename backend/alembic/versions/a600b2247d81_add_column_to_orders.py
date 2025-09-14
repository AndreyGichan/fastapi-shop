"""add column to orders

Revision ID: a600b2247d81
Revises: 3d8d998926ad
Create Date: 2025-09-14 20:36:46.027711

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a600b2247d81'
down_revision: Union[str, Sequence[str], None] = '3d8d998926ad'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "orders",
        sa.Column("address", sa.String(), nullable=False, server_default="Не указан"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("orders", "address")
