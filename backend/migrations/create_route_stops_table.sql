CREATE TABLE IF NOT EXISTS public.route_stops (
	id serial PRIMARY KEY,
	route_id int NOT NULL,
	stop_id int NOT NULL,
	UNIQUE (route_id, stop_id),
	FOREIGN KEY (route_id)
		REFERENCES routes (id)
		ON DELETE CASCADE,
	FOREIGN KEY (stop_id)
		REFERENCES stops (id)
		ON DELETE CASCADE
);
