CREATE TABLE public.stops (
	id serial PRIMARY KEY,
	name varchar(255) NOT NULL,
	lat float8 NOT NULL,
	lon float8 NOT NULL,
	active bool NOT NULL,
	UNIQUE (name),
	UNIQUE (lat, lon)
);
