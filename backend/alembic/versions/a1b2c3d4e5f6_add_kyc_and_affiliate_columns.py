"""
Add KYC and AffiliateProfile columns

Revision ID: a1b2c3d4e5f6
Revises: ca7a4ef0fdbe
Create Date: 2025-10-24
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'ca7a4ef0fdbe'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # KYCApplication additions
    with op.batch_alter_table('kyc_applications') as batch_op:
        batch_op.add_column(sa.Column('id_number', sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column('pharmacy_license_number', sa.String(length=64), nullable=True))
    # AffiliateProfile additions
    with op.batch_alter_table('affiliate_profiles') as batch_op:
        batch_op.add_column(sa.Column('full_name', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('bank_name', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('bank_account_name', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('bank_account_number', sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column('iban', sa.String(length=64), nullable=True))

def downgrade() -> None:
    with op.batch_alter_table('affiliate_profiles') as batch_op:
        batch_op.drop_column('iban')
        batch_op.drop_column('bank_account_number')
        batch_op.drop_column('bank_account_name')
        batch_op.drop_column('bank_name')
        batch_op.drop_column('full_name')
    with op.batch_alter_table('kyc_applications') as batch_op:
        batch_op.drop_column('pharmacy_license_number')
        batch_op.drop_column('id_number')
