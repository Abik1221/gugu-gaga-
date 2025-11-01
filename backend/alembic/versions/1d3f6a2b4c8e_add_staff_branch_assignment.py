"""add assigned_branch_id to users

Revision ID: 1d3f6a2b4c8e
Revises: f5c12de6e3a5
Create Date: 2025-11-01 06:23:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "1d3f6a2b4c8e"
down_revision: Union[str, None] = "f5c12de6e3a5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_columns = {col["name"] for col in inspector.get_columns("users")}
    existing_indexes = {idx["name"] for idx in inspector.get_indexes("users")}
    existing_fks = {fk["name"] for fk in inspector.get_foreign_keys("users") if fk.get("name")}

    if "assigned_branch_id" not in existing_columns:
        op.add_column("users", sa.Column("assigned_branch_id", sa.Integer(), nullable=True))

    if bind.dialect.name != "sqlite" and "fk_users_assigned_branch_id" not in existing_fks:
        op.create_foreign_key(
            "fk_users_assigned_branch_id",
            "users",
            "branches",
            ["assigned_branch_id"],
            ["id"],
            ondelete="SET NULL",
        )

    if "ix_users_assigned_branch_id" not in existing_indexes:
        if bind.dialect.name == "sqlite":
            op.execute(sa.text("CREATE INDEX IF NOT EXISTS ix_users_assigned_branch_id ON users (assigned_branch_id)"))
        else:
            op.create_index("ix_users_assigned_branch_id", "users", ["assigned_branch_id"])


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_columns = {col["name"] for col in inspector.get_columns("users")}
    existing_indexes = {idx["name"] for idx in inspector.get_indexes("users")}
    existing_fks = {fk["name"] for fk in inspector.get_foreign_keys("users") if fk.get("name")}

    if "ix_users_assigned_branch_id" in existing_indexes:
        if bind.dialect.name == "sqlite":
            op.execute(sa.text("DROP INDEX IF EXISTS ix_users_assigned_branch_id"))
        else:
            op.drop_index("ix_users_assigned_branch_id", table_name="users")

    if "fk_users_assigned_branch_id" in existing_fks and bind.dialect.name != "sqlite":
        op.drop_constraint("fk_users_assigned_branch_id", "users", type_="foreignkey")

    if "assigned_branch_id" in existing_columns:
        op.drop_column("users", "assigned_branch_id")
