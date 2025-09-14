"""alter column orders

Revision ID: 9b9ee86f28ac
Revises: a600b2247d81
Create Date: 2025-09-14 20:55:19.652635

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9b9ee86f28ac'
down_revision: Union[str, Sequence[str], None] = 'a600b2247d81'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        "orders",
        "status",
        existing_type=sa.String(),
        server_default=sa.text("'в обработке'")
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column(
        "orders",
        "status",
        existing_type=sa.String(),
        server_default=sa.text("'в ожидании'")
    )
