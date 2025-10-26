"""add kyc document columns

Revision ID: d7a9b6c4e3f1
Revises: f5c12de6e3a5
Create Date: 2025-10-26 08:59:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d7a9b6c4e3f1"
down_revision = "f5c12de6e3a5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("kyc_applications", sa.Column("license_document_name", sa.String(length=255), nullable=True))
    op.add_column("kyc_applications", sa.Column("license_document_mime", sa.String(length=64), nullable=True))
    op.add_column("kyc_applications", sa.Column("license_document_data", sa.LargeBinary(), nullable=True))
    op.add_column("kyc_applications", sa.Column("pharmacy_name", sa.String(length=255), nullable=True))
    op.add_column("kyc_applications", sa.Column("pharmacy_address", sa.String(length=255), nullable=True))
    op.add_column("kyc_applications", sa.Column("owner_email", sa.String(length=255), nullable=True))
    op.add_column("kyc_applications", sa.Column("owner_phone", sa.String(length=64), nullable=True))


def downgrade() -> None:
    op.drop_column("kyc_applications", "owner_phone")
    op.drop_column("kyc_applications", "owner_email")
    op.drop_column("kyc_applications", "pharmacy_address")
    op.drop_column("kyc_applications", "pharmacy_name")
    op.drop_column("kyc_applications", "license_document_data")
    op.drop_column("kyc_applications", "license_document_mime")
    op.drop_column("kyc_applications", "license_document_name")
