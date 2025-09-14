"""add column users

Revision ID: 3d8d998926ad
Revises: f9e9ea84fd62
Create Date: 2025-09-12 14:02:02.825779

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3d8d998926ad"
down_revision: Union[str, Sequence[str], None] = "f9e9ea84fd62"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "users",
        sa.Column("last_name", sa.String(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "last_name")
