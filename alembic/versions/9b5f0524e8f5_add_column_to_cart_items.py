"""add_column_to_cart_items

Revision ID: 9b5f0524e8f5
Revises: 24224471abc5
Create Date: 2025-09-03 14:53:34.539722

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9b5f0524e8f5"
down_revision: Union[str, Sequence[str], None] = "24224471abc5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "cart_items",
        sa.Column(
            "product_id",
            sa.Integer,
            sa.ForeignKey("products.id", ondelete="CASCADE"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("cart_items", "product_id")
