CREATE TABLE public.analytics (
	id serial PRIMARY KEY,
	van_id int NOT NULL,
	route_id int NOT NULL,
	entered int NOT NULL,
	exited int NOT NULL,
	lat float8 NOT NULL,
	lon float8 NOT NULL,
	datetime timestamp NOT NULL,
	UNIQUE (van_id, datetime),
	FOREIGN KEY (van_id)
		REFERENCES vans (id)
		ON DELETE CASCADE,
	FOREIGN KEY (route_id)
		REFERENCES routes (id)
		ON DELETE CASCADE
);
