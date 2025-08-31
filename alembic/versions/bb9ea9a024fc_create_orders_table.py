"""create orders table

Revision ID: bb9ea9a024fc
Revises: 190176213ac0
Create Date: 2025-08-31 17:10:37.536126

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bb9ea9a024fc'
down_revision: Union[str, Sequence[str], None] = '190176213ac0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "orders",
        sa.Column("id", sa.Integer, primary_key=True, nullable=False),
        sa.Column(
            "user_id",
            sa.Integer,
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("total_price", sa.Float, nullable=False),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column("status", sa.String, default="в ожидании"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("orders")
