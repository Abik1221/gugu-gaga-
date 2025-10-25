"""merge heads

Revision ID: 9a0703d97b19
Revises: 247bffd334a8, b2c3d4e5f6a7
Create Date: 2025-10-24 22:48:15.753456

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9a0703d97b19"
down_revision = ('247bffd334a8', 'b2c3d4e5f6a7')
branch_labels = None
depends_on = None

def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
