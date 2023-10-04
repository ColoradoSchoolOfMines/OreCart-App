CREATE TABLE public.route_vans (
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