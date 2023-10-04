CREATE TABLE public.route_disables (
	id serial PRIMARY KEY,
	alert_id int NOT NULL,
	route_id int NOT NULL,
	FOREIGN KEY (alert_id)
		REFERENCES alerts (id)
		ON DELETE CASCADE,
	FOREIGN KEY (route_id)
		REFERENCES routes (id)
		ON DELETE CASCADE
);
