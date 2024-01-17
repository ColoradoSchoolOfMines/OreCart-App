"""vans_table sqlalchemy

Revision ID: 77a4e3e6a717
Revises: 6e4f31366fd6
Create Date: 2024-01-16 21:06:40.363016

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "77a4e3e6a717"
down_revision: Union[str, None] = "6e4f31366fd6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("vans")
    op.create_table(
        "vans",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("route_id", sa.Integer),
        sa.Column("wheelchair", sa.Boolean, nullable=False),
        sa.ForeignKeyConstraint(["route_id"], ["routes.id"], ondelete="SET NULL"),
    )


def downgrade() -> None:
    op.drop_table("vans")
