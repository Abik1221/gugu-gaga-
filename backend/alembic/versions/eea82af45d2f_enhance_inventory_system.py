"""enhance_inventory_system

Revision ID: eea82af45d2f
Revises: 5f42ff322c9b
Create Date: 2025-11-24 08:45:52.875944

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eea82af45d2f'
down_revision: Union[str, None] = '5f42ff322c9b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


from sqlalchemy import inspect

def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    
    if inspector.has_table('_alembic_tmp_inventory_items'):
        op.drop_table('_alembic_tmp_inventory_items')
        
    columns = [c['name'] for c in inspector.get_columns('inventory_items')]

    if 'unit_type' not in columns:
        op.add_column('inventory_items', sa.Column('unit_type', sa.String(length=50), server_default='unit', nullable=True))
    if 'packaging_data' not in columns:
        op.add_column('inventory_items', sa.Column('packaging_data', sa.JSON(), nullable=True))
    if 'last_updated_by' not in columns:
        op.add_column('inventory_items', sa.Column('last_updated_by', sa.Integer(), nullable=True))
    if 'last_update_reason' not in columns:
        op.add_column('inventory_items', sa.Column('last_update_reason', sa.Text(), nullable=True))
    if 'price_per_unit' not in columns:
        op.add_column('inventory_items', sa.Column('price_per_unit', sa.Float(), nullable=True))
    
    # Create foreign key for last_updated_by using batch mode
    with op.batch_alter_table('inventory_items', schema=None) as batch_op:
        batch_op.create_foreign_key('fk_inventory_items_last_updated_by', 'users', ['last_updated_by'], ['id'])

    # Create inventory_transactions table
    if not inspector.has_table('inventory_transactions'):
        op.create_table('inventory_transactions',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('inventory_item_id', sa.Integer(), nullable=True),
            sa.Column('transaction_type', sa.String(length=50), nullable=True),
            sa.Column('quantity_change', sa.Integer(), nullable=True),
            sa.Column('quantity_before', sa.Integer(), nullable=True),
            sa.Column('quantity_after', sa.Integer(), nullable=True),
            sa.Column('reason', sa.Text(), nullable=True),
            sa.Column('created_by', sa.Integer(), nullable=True),
            sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
            sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
            sa.ForeignKeyConstraint(['inventory_item_id'], ['inventory_items.id'], ),
            sa.PrimaryKeyConstraint('id')
        )


def downgrade() -> None:
    op.drop_table('inventory_transactions')
    with op.batch_alter_table('inventory_items', schema=None) as batch_op:
        batch_op.drop_constraint('fk_inventory_items_last_updated_by', type_='foreignkey')
        batch_op.drop_column('price_per_unit')
        batch_op.drop_column('last_update_reason')
        batch_op.drop_column('last_updated_by')
        batch_op.drop_column('packaging_data')
        batch_op.drop_column('unit_type')
