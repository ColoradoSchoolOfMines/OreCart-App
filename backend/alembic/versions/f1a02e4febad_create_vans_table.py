"""create vans table

Revision ID: f1a02e4febad
Revises: 311f80f8b8dd
Create Date: 2023-10-04 17:31:57.484449

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "f1a02e4febad"
down_revision: Union[str, None] = "311f80f8b8dd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS public.vans (
	        id serial PRIMARY KEY,
	        route_id int,
	        wheelchair bool NOT NULL,
	        FOREIGN KEY (route_id)
		        REFERENCES routes (id)
		        ON DELETE SET NULL
        );
    """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS public.vans;
    """
    )
