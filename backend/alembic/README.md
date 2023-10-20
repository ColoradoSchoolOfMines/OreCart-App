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

For more information on creating and managing migrations, [read the docs](https://alembic.sqlalchemy.org/en/latest/tutorial.html#create-a-migration-script)
