CREATE TABLE IF NOT EXISTS public.schedules (
	id serial PRIMARY KEY,
	route_id int NOT NULL,
	dow int NOT NULL CHECK (dow >= 0 AND dow <= 6), -- Sunday is 0 (https://www.postgresql.org/docs/8.1/functions-datetime.html)
	start_time time NOT NULL,
	end_time time NOT NULL CHECK (end_time > start_time),
	UNIQUE (route_id, dow),
	FOREIGN KEY (route_id)
		REFERENCES routes (id)
		ON DELETE CASCADE
);
