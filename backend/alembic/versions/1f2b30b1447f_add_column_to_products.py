"""add_column_to_products

Revision ID: 1f2b30b1447f
Revises: bb9ea9a024fc
Create Date: 2025-09-02 13:36:20.301820

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1f2b30b1447f'
down_revision: Union[str, Sequence[str], None] = 'bb9ea9a024fc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "products",
        sa.Column("category", sa.String(), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("products", "category")
