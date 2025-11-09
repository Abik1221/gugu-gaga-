"""add payment terms and license image

Revision ID: add_payment_terms_license
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_payment_terms_license'
down_revision = None  # Update this to your latest migration
branch_labels = None
depends_on = None


def upgrade():
    # Add payment terms to supplier_products
    op.add_column('supplier_products', sa.Column('upfront_payment_percent', sa.Integer(), nullable=False, server_default='50'))
    op.add_column('supplier_products', sa.Column('after_delivery_percent', sa.Integer(), nullable=False, server_default='50'))
    
    # Change business_license_number to business_license_image in supplier_kyc
    op.add_column('supplier_kyc', sa.Column('business_license_image', sa.String(length=500), nullable=True))
    # Copy data if needed
    op.execute("UPDATE supplier_kyc SET business_license_image = business_license_number WHERE business_license_number IS NOT NULL")
    op.drop_column('supplier_kyc', 'business_license_number')


def downgrade():
    # Revert supplier_kyc changes
    op.add_column('supplier_kyc', sa.Column('business_license_number', sa.String(length=100), nullable=True))
    op.execute("UPDATE supplier_kyc SET business_license_number = business_license_image WHERE business_license_image IS NOT NULL")
    op.drop_column('supplier_kyc', 'business_license_image')
    
    # Remove payment terms from supplier_products
    op.drop_column('supplier_products', 'after_delivery_percent')
    op.drop_column('supplier_products', 'upfront_payment_percent')
