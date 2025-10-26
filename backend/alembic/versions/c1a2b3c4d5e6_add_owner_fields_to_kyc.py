"""add owner fields to kyc application"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "c1a2b3c4d5e6"
down_revision = "8bcbb606fb23"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("kyc_applications") as batch_op:
        batch_op.add_column(sa.Column("pharmacy_name", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("pharmacy_address", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("owner_email", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("owner_phone", sa.String(length=64), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("kyc_applications") as batch_op:
        batch_op.drop_column("owner_phone")
        batch_op.drop_column("owner_email")
        batch_op.drop_column("pharmacy_address")
        batch_op.drop_column("pharmacy_name")
