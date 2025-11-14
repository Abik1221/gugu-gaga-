"""affiliate profile update

Revision ID: 0d83f7ea3b45
Revises: add_tenant_activity_logs
Create Date: 2025-11-14 09:25:36.932047

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0d83f7ea3b45'
down_revision: Union[str, None] = 'add_tenant_activity_logs'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new columns with default values for SQLite compatibility
    op.add_column('affiliate_profiles', sa.Column('phone', sa.String(length=32), nullable=True))
    op.add_column('affiliate_profiles', sa.Column('address', sa.String(length=500), nullable=True))
    
    # Update existing records with default values
    op.execute("UPDATE affiliate_profiles SET phone = 'N/A' WHERE phone IS NULL")
    op.execute("UPDATE affiliate_profiles SET address = 'N/A' WHERE address IS NULL")
    op.execute("UPDATE affiliate_profiles SET full_name = 'N/A' WHERE full_name IS NULL")


def downgrade() -> None:
    # Remove the new columns
    op.drop_column('affiliate_profiles', 'address')
    op.drop_column('affiliate_profiles', 'phone')