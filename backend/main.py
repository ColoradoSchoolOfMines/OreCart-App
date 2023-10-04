from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class VanLocation(BaseModel):
    lat: float
    long: float
    van_id: int
    timestamp: int


@app.get("/location/{van_id}")
def get_van_location(van_id: int) -> VanLocation:
    # get van location and return a proper VanLocation object

    return VanLocation(lat=0.0, long=0.0, van_id=van_id, timestamp=0)


@app.post("/location/{van_id}")
def post_van_location(van_id: int, van_location: VanLocation):
    # update van location in database

    return {"message": "Location updated successfully."}


# TODO: Unsure of where this code should be located in the file
create_analytics_sql = ("CREATE TABLE IF NOT EXISTS analytics ("
"id INTEGER," # TODO: Maybe make this a PRIMARY KEY
"van_id INTEGER," # Likely make this a foreign key, but potentially do later via ALTER
"route_id INTEGER," # Likely make this a foreign key, but potentially do later via ALTER
"entered INTEGER,"
"exited INTEGER,"
"lat DECIMAL(6,5),"
"lon DECIMAL(6,5),"
"ts TIMESTAMP"
");")