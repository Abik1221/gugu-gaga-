"""add tenant_activity_logs table

Revision ID: add_tenant_activity_logs
Revises: e1f2a3b4c5d6
Create Date: 2025-11-13 19:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_tenant_activity_logs'
down_revision: Union[str, None] = 'e1f2a3b4c5d6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create tenant_activity_logs table
    op.create_table('tenant_activity_logs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('actor_user_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(length=128), nullable=False),
        sa.Column('message', sa.String(length=512), nullable=False),
        sa.Column('target_type', sa.String(length=64), nullable=True),
        sa.Column('target_id', sa.String(length=64), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tenant_activity_logs_tenant_id'), 'tenant_activity_logs', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_tenant_activity_logs_actor_user_id'), 'tenant_activity_logs', ['actor_user_id'], unique=False)
    op.create_index(op.f('ix_tenant_activity_logs_action'), 'tenant_activity_logs', ['action'], unique=False)


def downgrade() -> None:
    # Drop tenant_activity_logs table
    op.drop_index(op.f('ix_tenant_activity_logs_action'), table_name='tenant_activity_logs')
    op.drop_index(op.f('ix_tenant_activity_logs_actor_user_id'), table_name='tenant_activity_logs')
    op.drop_index(op.f('ix_tenant_activity_logs_tenant_id'), table_name='tenant_activity_logs')
    op.drop_table('tenant_activity_logs')