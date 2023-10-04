CREATE TABLE public.waypoints (
	id serial PRIMARY KEY,
	route_id int NOT NULL,
	lat float8 NOT NULL,
	lon float8 NOT NULL,
	UNIQUE (route_id, lat, lon),
	FOREIGN KEY (route_id)
		REFERENCES routes (id)
);
