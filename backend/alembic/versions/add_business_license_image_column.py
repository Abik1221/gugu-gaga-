"""add business_license_image column

Revision ID: add_business_license_image_column
Revises: d6082e47e632
Create Date: 2025-11-09

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_business_license_image_column'
down_revision = 'd6082e47e632'
branch_labels = None
depends_on = None


def upgrade():
    # Add business_license_image column to supplier_kyc table
    op.add_column('supplier_kyc', sa.Column('business_license_image', sa.String(500), nullable=True))


def downgrade():
    # Remove business_license_image column from supplier_kyc table
    op.drop_column('supplier_kyc', 'business_license_image')
