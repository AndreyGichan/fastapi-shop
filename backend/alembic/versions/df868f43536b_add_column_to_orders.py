"""add column to orders

Revision ID: df868f43536b
Revises: 7e7c9df58f36
Create Date: 2025-09-16 11:37:03.734561

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "df868f43536b"
down_revision: Union[str, Sequence[str], None] = "7e7c9df58f36"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "orders",
        sa.Column("phone", sa.String(), nullable=False, server_default="Не указан"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("orders", "phone")
