"""create table product reviews

Revision ID: 7e7c9df58f36
Revises: 4eee90913b1e
Create Date: 2025-09-15 16:16:28.620953

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "7e7c9df58f36"
down_revision: Union[str, Sequence[str], None] = "4eee90913b1e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "product_reviews",
        sa.Column("id", sa.Integer, primary_key=True, nullable=False),
        sa.Column(
            "product_id",
            sa.Integer,
            sa.ForeignKey("products.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Integer,
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "rating",
            sa.Integer,
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.UniqueConstraint("product_id", "user_id", name="uq_product_user_review"),
        sa.CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating_range"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("product_reviews")
