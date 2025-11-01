"""add_customers_table

Revision ID: 6095eff5dfa8
Revises: c15a472cb275
Create Date: 2025-11-01 10:13:56.682310

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "6095eff5dfa8"
down_revision = "c15a472cb275"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    is_sqlite = bind.dialect.name == "sqlite"

    op.create_table(
        "customers",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("tenant_id", sa.String(length=64), nullable=False),
        sa.Column("branch_id", sa.Integer(), nullable=True),
        sa.Column("created_by_user_id", sa.Integer(), nullable=True),
        sa.Column("first_name", sa.String(length=120), nullable=True),
        sa.Column("last_name", sa.String(length=120), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=32), nullable=True),
        sa.Column("gender", sa.String(length=32), nullable=True),
        sa.Column("date_of_birth", sa.Date(), nullable=True),
        sa.Column("address", sa.String(length=255), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("meds_regimen", sa.Text(), nullable=True),
        sa.Column("refill_frequency_days", sa.Integer(), nullable=True),
        sa.Column("next_refill_date", sa.Date(), nullable=True),
        sa.Column("last_refill_date", sa.Date(), nullable=True),
        sa.Column("loyalty_tier", sa.String(length=64), nullable=True),
        sa.Column("engagement_notes", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["branch_id"], ["branches.id"], name="fk_customers_branch_id", ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["created_by_user_id"], ["users.id"], name="fk_customers_created_by", ondelete="SET NULL"),
    )

    if is_sqlite:
        op.execute(sa.text("CREATE INDEX IF NOT EXISTS ix_customers_tenant_branch ON customers (tenant_id, branch_id)"))
        op.execute(sa.text("CREATE INDEX IF NOT EXISTS ix_customers_email ON customers (tenant_id, email)"))
        op.execute(sa.text("CREATE INDEX IF NOT EXISTS ix_customers_phone ON customers (tenant_id, phone)"))
    else:
        op.create_index("ix_customers_tenant_branch", "customers", ["tenant_id", "branch_id"])
        op.create_index("ix_customers_email", "customers", ["tenant_id", "email"])
        op.create_index("ix_customers_phone", "customers", ["tenant_id", "phone"])


def downgrade() -> None:
    bind = op.get_bind()
    is_sqlite = bind.dialect.name == "sqlite"

    if is_sqlite:
        op.execute(sa.text("DROP INDEX IF EXISTS ix_customers_phone"))
        op.execute(sa.text("DROP INDEX IF EXISTS ix_customers_email"))
        op.execute(sa.text("DROP INDEX IF EXISTS ix_customers_tenant_branch"))
    else:
        op.drop_index("ix_customers_phone", table_name="customers")
        op.drop_index("ix_customers_email", table_name="customers")
        op.drop_index("ix_customers_tenant_branch", table_name="customers")

    op.drop_table("customers")
