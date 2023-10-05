CREATE TABLE IF NOT EXISTS IF NOT EXISTS public.alerts (
	id serial PRIMARY KEY,
	text VARCHAR(500) NOT NULL,
	start_datetime timestamp NOT NULL,
	end_datetime timestamp NOT NULL CHECK (end_datetime > start_datetime)
);
