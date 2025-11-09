"""merge_heads_for_license_image

Revision ID: 4aefd9d4705a
Revises: add_business_license_image_column, add_payment_terms_license
Create Date: 2025-11-09 14:56:55.434621

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4aefd9d4705a"
down_revision = ('add_business_license_image_column', 'add_payment_terms_license')
branch_labels = None
depends_on = None

def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
