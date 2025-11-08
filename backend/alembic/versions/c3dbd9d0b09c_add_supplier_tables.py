"""add_supplier_tables

Revision ID: c3dbd9d0b09c
Revises: 6095eff5dfa8
Create Date: 2025-11-08 10:34:49.466426

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "c3dbd9d0b09c"
down_revision = '6095eff5dfa8'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create suppliers table
    op.create_table('suppliers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('company_name', sa.String(length=255), nullable=False),
        sa.Column('business_license', sa.String(length=255), nullable=True),
        sa.Column('tax_id', sa.String(length=100), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=True),
        sa.Column('country', sa.String(length=100), nullable=True),
        sa.Column('phone', sa.String(length=32), nullable=True),
        sa.Column('website', sa.String(length=255), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_verified', sa.Boolean(), nullable=False, default=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('rating', sa.Numeric(precision=3, scale=2), nullable=True, default=0.0),
        sa.Column('total_orders', sa.Integer(), nullable=False, default=0),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_suppliers_user_id', 'suppliers', ['user_id'], unique=False)

    # Create supplier_products table
    op.create_table('supplier_products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('supplier_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('sku', sa.String(length=100), nullable=True),
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('unit', sa.String(length=50), nullable=False, default='piece'),
        sa.Column('min_order_quantity', sa.Integer(), nullable=False, default=1),
        sa.Column('stock_quantity', sa.Integer(), nullable=False, default=0),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_supplier_products_supplier_id', 'supplier_products', ['supplier_id'], unique=False)
    op.create_index('ix_supplier_products_sku', 'supplier_products', ['sku'], unique=False)

    # Create orders table
    op.create_table('orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_number', sa.String(length=50), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('supplier_id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(length=64), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, default='pending'),
        sa.Column('total_amount', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('payment_method', sa.String(length=50), nullable=True),
        sa.Column('payment_code', sa.String(length=100), nullable=True),
        sa.Column('delivery_address', sa.Text(), nullable=True),
        sa.Column('delivery_phone', sa.String(length=32), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('approved_at', sa.DateTime(), nullable=True),
        sa.Column('payment_verified_at', sa.DateTime(), nullable=True),
        sa.Column('delivered_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('order_number')
    )
    op.create_index('ix_orders_customer_id', 'orders', ['customer_id'], unique=False)
    op.create_index('ix_orders_supplier_id', 'orders', ['supplier_id'], unique=False)
    op.create_index('ix_orders_tenant_id', 'orders', ['tenant_id'], unique=False)
    op.create_index('ix_orders_status', 'orders', ['status'], unique=False)
    op.create_index('ix_orders_payment_code', 'orders', ['payment_code'], unique=False)

    # Create order_items table
    op.create_table('order_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('unit_price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('total_price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['product_id'], ['supplier_products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_order_items_order_id', 'order_items', ['order_id'], unique=False)
    op.create_index('ix_order_items_product_id', 'order_items', ['product_id'], unique=False)

    # Create order_reviews table
    op.create_table('order_reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('supplier_id', sa.Integer(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['customer_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_order_reviews_order_id', 'order_reviews', ['order_id'], unique=False)
    op.create_index('ix_order_reviews_customer_id', 'order_reviews', ['customer_id'], unique=False)
    op.create_index('ix_order_reviews_supplier_id', 'order_reviews', ['supplier_id'], unique=False)


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('order_reviews')
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('supplier_products')
    op.drop_table('suppliers')