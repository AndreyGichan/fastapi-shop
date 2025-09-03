"""create_cart_item_table

Revision ID: 24224471abc5
Revises: 8ebcabb1129b
Create Date: 2025-09-03 14:02:11.766313

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "24224471abc5"
down_revision: Union[str, Sequence[str], None] = "8ebcabb1129b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "cart_items",
        sa.Column("id", sa.Integer, primary_key=True, nullable=False),
        sa.Column(
            "cart_id",
            sa.Integer,
            sa.ForeignKey("cart.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("price", sa.Float, nullable=False),
        sa.Column("quantity", sa.Integer),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("cart_items")
