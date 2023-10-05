CREATE TABLE IF NOT EXISTS public.routes (
	id serial PRIMARY KEY,
	name varchar(255) NOT NULL,
	UNIQUE (name)
);
