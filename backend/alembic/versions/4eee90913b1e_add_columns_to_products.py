"""add columns to products

Revision ID: 4eee90913b1e
Revises: 9b9ee86f28ac
Create Date: 2025-09-15 15:42:31.745772

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4eee90913b1e"
down_revision: Union[str, Sequence[str], None] = "9b9ee86f28ac"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "products",
        sa.Column(
            "original_price",
            sa.Float,
            nullable=True,
        ),
    )
    op.add_column(
        "products",
        sa.Column(
            "discount",
            sa.Float,
            nullable=True,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("products", "original_price")
    op.drop_column("products", "discount")
