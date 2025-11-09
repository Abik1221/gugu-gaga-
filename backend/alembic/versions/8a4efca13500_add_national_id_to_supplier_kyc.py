"""add_national_id_to_supplier_kyc

Revision ID: 8a4efca13500
Revises: 4aefd9d4705a
Create Date: 2025-11-09 15:49:04.657121

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "8a4efca13500"
down_revision = '4aefd9d4705a'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('supplier_kyc', sa.Column('national_id', sa.String(length=100), nullable=True))


def downgrade() -> None:
    op.drop_column('supplier_kyc', 'national_id')
