"""add missing tables

Revision ID: e1f2a3b4c5d6
Revises: d84e49e238e0
Create Date: 2025-11-12 15:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1f2a3b4c5d6'
down_revision: Union[str, None] = 'd84e49e238e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create user_tenants table
    op.create_table('user_tenants',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('role_override', sa.String(length=32), nullable=True),
        sa.Column('is_approved', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_tenants_user_id'), 'user_tenants', ['user_id'], unique=False)
    op.create_index(op.f('ix_user_tenants_tenant_id'), 'user_tenants', ['tenant_id'], unique=False)

    # Create subscriptions table
    op.create_table('subscriptions',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('plan', sa.String(length=32), nullable=False, server_default='basic'),
        sa.Column('status', sa.String(length=16), nullable=False, server_default='active'),
        sa.Column('blocked', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('next_due_date', sa.Date(), nullable=True),
        sa.Column('daily_notice_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_subscriptions_tenant_id'), 'subscriptions', ['tenant_id'], unique=True)
    op.create_index(op.f('ix_subscriptions_status'), 'subscriptions', ['status'], unique=False)

    # Create payment_submissions table
    op.create_table('payment_submissions',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(length=64), nullable=False),
        sa.Column('status', sa.String(length=16), nullable=False, server_default='pending'),
        sa.Column('amount', sa.Float(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('verified_at', sa.DateTime(), nullable=True),
        sa.Column('verified_by_user_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payment_submissions_tenant_id'), 'payment_submissions', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_payment_submissions_code'), 'payment_submissions', ['code'], unique=False)
    op.create_index(op.f('ix_payment_submissions_status'), 'payment_submissions', ['status'], unique=False)

    # Create tenant_activity table
    op.create_table('tenant_activity',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('actor_user_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(length=128), nullable=False),
        sa.Column('message', sa.String(length=500), nullable=False),
        sa.Column('target_type', sa.String(length=64), nullable=True),
        sa.Column('target_id', sa.String(length=64), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tenant_activity_tenant_id'), 'tenant_activity', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_tenant_activity_action'), 'tenant_activity', ['action'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_tenant_activity_action'), table_name='tenant_activity')
    op.drop_index(op.f('ix_tenant_activity_tenant_id'), table_name='tenant_activity')
    op.drop_table('tenant_activity')
    
    op.drop_index(op.f('ix_payment_submissions_status'), table_name='payment_submissions')
    op.drop_index(op.f('ix_payment_submissions_code'), table_name='payment_submissions')
    op.drop_index(op.f('ix_payment_submissions_tenant_id'), table_name='payment_submissions')
    op.drop_table('payment_submissions')
    
    op.drop_index(op.f('ix_subscriptions_status'), table_name='subscriptions')
    op.drop_index(op.f('ix_subscriptions_tenant_id'), table_name='subscriptions')
    op.drop_table('subscriptions')
    
    op.drop_index(op.f('ix_user_tenants_tenant_id'), table_name='user_tenants')
    op.drop_index(op.f('ix_user_tenants_user_id'), table_name='user_tenants')
    op.drop_table('user_tenants')