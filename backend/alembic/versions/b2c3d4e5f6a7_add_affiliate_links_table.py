"""
Add affiliate_links table for multi-link per affiliate

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2025-10-24
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'b2c3d4e5f6a7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'affiliate_links',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('affiliate_user_id', sa.Integer(), nullable=False, index=True),
        sa.Column('token', sa.String(length=64), nullable=False, unique=True, index=True),
        sa.Column('active', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('(CURRENT_TIMESTAMP)')),
    )

def downgrade() -> None:
    op.drop_table('affiliate_links')
