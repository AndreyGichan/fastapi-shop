"""add column to orderitems

Revision ID: 190176213ac0
Revises: 117f1dd9a44e
Create Date: 2025-08-31 17:03:17.719452

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "190176213ac0"
down_revision: Union[str, Sequence[str], None] = "117f1dd9a44e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "order_items",
        sa.Column("price", sa.Float(), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("order_items", "price")
