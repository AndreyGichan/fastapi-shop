"""add_column_to_product_table

Revision ID: f9e9ea84fd62
Revises: 9b5f0524e8f5
Create Date: 2025-09-06 18:00:04.315657

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f9e9ea84fd62"
down_revision: Union[str, Sequence[str], None] = "9b5f0524e8f5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "products",
        sa.Column("image_url", sa.String(), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("products", "image_url")
