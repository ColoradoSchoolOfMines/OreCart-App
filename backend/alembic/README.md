# Alembic Migration

We use alembic to manage database migration.
Migration management is used to ensure that changes to a database schema are
consistent and deterministic.

In order to apply all migrations, run the following:

```bash
alembic upgrade head
```

In order to roll back all migrations, run the following:

```bash
alembic downgrade base
```

Migrations can also be applied one-at-a-time by using

```bash
alembic upgrade +1
```

Migrations should be created on all database changes using

```bash
alembic revision -m "descriptive message here"
```

This will generate a new file called something like "abcdef123456_descriptive_message_here.py". It will contain an "upgrade" method should take the current table state and update it to the new table schema, and a "downgrade" method that should take the upgraded table state and turn it back into the prior schema well. It's recommended to use the sqlalchemy ORM to create the tables, however if you need to drop a table it's reccommended to use raw SQL, as that will allow you to specify `DROP TABLE CASCADE` where SQLAlchemy's `drop_table` would not. This would result in situations where ex. dropping the `stops` table would fail since it would not cascade to `route_stops`.

For more information on creating and managing migrations, [read the docs](https://alembic.sqlalchemy.org/en/latest/tutorial.html#create-a-migration-script)