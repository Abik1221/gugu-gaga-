"""add_supplier_kyc_tables

Revision ID: d6082e47e632
Revises: c3dbd9d0b09c
Create Date: 2025-11-08 10:45:00.000000

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "d6082e47e632"
down_revision = 'c3dbd9d0b09c'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create supplier_kyc table
    op.create_table('supplier_kyc',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('supplier_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=16), nullable=False, default='pending'),
        sa.Column('business_license_number', sa.String(length=100), nullable=True),
        sa.Column('tax_certificate_number', sa.String(length=100), nullable=True),
        sa.Column('documents_path', sa.String(length=255), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(), nullable=False),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('reviewed_by_user_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['reviewed_by_user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_supplier_kyc_supplier_id', 'supplier_kyc', ['supplier_id'], unique=False)
    op.create_index('ix_supplier_kyc_status', 'supplier_kyc', ['status'], unique=False)

    # Create supplier_payment_submissions table
    op.create_table('supplier_payment_submissions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('supplier_id', sa.Integer(), nullable=False),
        sa.Column('code', sa.String(length=100), nullable=False),
        sa.Column('status', sa.String(length=16), nullable=False, default='pending'),
        sa.Column('amount', sa.Float(), nullable=True),
        sa.Column('payment_method', sa.String(length=50), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(), nullable=False),
        sa.Column('verified_at', sa.DateTime(), nullable=True),
        sa.Column('verified_by_user_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['verified_by_user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_supplier_payment_submissions_supplier_id', 'supplier_payment_submissions', ['supplier_id'], unique=False)
    op.create_index('ix_supplier_payment_submissions_code', 'supplier_payment_submissions', ['code'], unique=False)
    op.create_index('ix_supplier_payment_submissions_status', 'supplier_payment_submissions', ['status'], unique=False)


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('supplier_payment_submissions')
    op.drop_table('supplier_kyc')