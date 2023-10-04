"""create route_vans table

Revision ID: 25aed98a245a
Revises: 3e3261e602b0
Create Date: 2023-10-04 17:40:25.128305

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '25aed98a245a'
down_revision: Union[str, None] = '3e3261e602b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE IF NOT EXISTS public.route_vans (
	        id serial PRIMARY KEY,
	        van_id int NOT NULL,
	        route_id int NOT null,
	        UNIQUE (van_id, route_id),
	        FOREIGN KEY (van_id)
		        REFERENCES vans (id)
		        ON DELETE CASCADE,
	        FOREIGN KEY (route_id)
		        REFERENCES routes (id)
		        ON DELETE CASCADE
        );
    """);

def downgrade() -> None:
    op.execute("""
        DROP TABLE IF EXISTS public.route_vans;
    """);
