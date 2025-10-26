"""merge heads

Revision ID: 8bcbb606fb23
Revises: b4d3c512f19a, d7a9b6c4e3f1
Create Date: 2025-10-26 12:44:14.107829

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "8bcbb606fb23"
down_revision = ('b4d3c512f19a', 'd7a9b6c4e3f1')
branch_labels = None
depends_on = None

def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
