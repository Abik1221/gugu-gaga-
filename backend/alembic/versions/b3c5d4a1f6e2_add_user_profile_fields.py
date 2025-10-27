"""
Add user profile fields

Revision ID: b3c5d4a1f6e2
Revises: d79e2133e4e6
Create Date: 2025-10-27 21:10:00
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "b3c5d4a1f6e2"
down_revision = "d79e2133e4e6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("users") as batch_op:
        batch_op.add_column(sa.Column("username", sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column("first_name", sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column("last_name", sa.String(length=120), nullable=True))
        batch_op.create_unique_constraint("uq_users_username", ["username"])


def downgrade() -> None:
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_constraint("uq_users_username", type_="unique")
        batch_op.drop_column("last_name")
        batch_op.drop_column("first_name")
        batch_op.drop_column("username")
