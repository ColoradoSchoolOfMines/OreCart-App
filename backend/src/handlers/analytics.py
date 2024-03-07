from fastapi import APIRouter, Request
from pydantic import BaseModel
from sqlalchemy import text

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/route/{route_id}")
def get_analytics(request:Request, route_id:int):
    with request.app.state.engine.connect() as connection:
        connection.execute(text("INSERT INTO routes VALUES (1, 'iron');"))
        connection.execute(text("INSERT INTO route_analytics VALUES (1, 1, '1970-01-01 00:00:01');"))
        row = connection.execute(text("SELECT * FROM route_analytics WHERE route_id="+str(route_id)))
        for x in row:
            print(x)
