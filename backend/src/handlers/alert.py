import datetime

from fastapi import APIRouter, Form, Request
from fastapi.responses import JSONResponse
from src.model.alert import Alert

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("/")
def post_alert(
    req: Request, text: str = Form(), start_time: int = Form(), end_time: int = Form()
) -> JSONResponse:
    with req.app.state.db.session() as session:
        dt_start_time = datetime.datetime.fromtimestamp(start_time)
        dt_end_time = datetime.datetime.fromtimestamp(end_time)

        alert = Alert(text=text, start_datetime=dt_start_time, end_datetime=dt_end_time)
        session.add(alert)
        session.commit()

    return JSONResponse(content={"message": "OK"})
