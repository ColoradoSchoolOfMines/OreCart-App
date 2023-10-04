"""create stops table

Revision ID: 174e5a759f2d
Revises: dc6fb3eee9e3
Create Date: 2023-10-04 17:25:22.810006

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '174e5a759f2d'
down_revision: Union[str, None] = 'dc6fb3eee9e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE IF NOT EXISTS public.stops (
	        id serial PRIMARY KEY,
	        name varchar(255) NOT NULL,
	        lat float8 NOT NULL,
	        lon float8 NOT NULL,
	        active bool NOT NULL,
	        UNIQUE (name),
	        UNIQUE (lat, lon)
        );
    """);


def downgrade() -> None:
    op.execute("""
        DROP TABLE IF EXISTS public.stops;
    """);
