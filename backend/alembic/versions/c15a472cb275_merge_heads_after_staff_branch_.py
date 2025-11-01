"""merge heads after staff branch assignment

Revision ID: c15a472cb275
Revises: 04903bc77782, 1d3f6a2b4c8e
Create Date: 2025-11-01 09:34:44.684311

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c15a472cb275"
down_revision = ('04903bc77782', '1d3f6a2b4c8e')
branch_labels = None
depends_on = None

def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
