import datetime
from typing import List, Union

from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from src.model.alert import Alert

router = APIRouter(prefix="/alerts", tags=["alerts"])


class AlertModel(BaseModel):
    """
    A JSON model mapping
    for the Alert object.
    """

    text: str
    start_time: int
    end_time: int


@router.get("/")
def get_alerts(
    req: Request, include: Union[List[str], None] = Query(default=None)
) -> JSONResponse:
    with req.app.state.db.session() as session:
        alerts: List[Alert] = session.query(Alert).all()

    resp = {"alerts": []}
    for alert in alerts:
        filtered_alert = {}

        filtered_alert["id"] = alert.id
        if include is None or "text" in include:
            filtered_alert["text"] = alert.text

        if include is None or "start" in include:
            filtered_alert["start"] = str(alert.start_datetime)

        if include is None or "end" in include:
            filtered_alert["end"] = str(alert.end_datetime)

        resp["alerts"].append(filtered_alert)

    return JSONResponse(content=resp)


@router.get("/{alert_id}")
def get_alert(
    req: Request, alert_id: int, include: Union[List[str], None] = Query(default=None)
) -> JSONResponse:
    with req.app.state.db.session() as session:
        alert: Alert = session.query(Alert).filter_by(id=alert_id).first()
        if alert is None:
            return JSONResponse(content={"message": "Alert not found"}, status_code=404)

    filtered_alert = {}

    if include is None or "text" in include:
        filtered_alert["text"] = alert.text

    if include is None or "start" in include:
        filtered_alert["start"] = str(alert.start_datetime)

    if include is None or "end" in include:
        filtered_alert["end"] = str(alert.end_datetime)

    return JSONResponse(content=filtered_alert)


@router.post("/")
def post_alert(req: Request, alert_model: AlertModel) -> JSONResponse:
    with req.app.state.db.session() as session:
        dt_start_time = datetime.datetime.fromtimestamp(alert_model.start_time)
        dt_end_time = datetime.datetime.fromtimestamp(alert_model.end_time)

        alert = Alert(
            text=alert_model.text,
            start_datetime=dt_start_time,
            end_datetime=dt_end_time,
        )
        session.add(alert)
        session.commit()

    return JSONResponse(content={"message": "OK"})


@router.put("/{alert_id}")
def update_alert(req: Request, alert_id: int, alert_model: AlertModel) -> JSONResponse:
    with req.app.state.db.session() as session:
        alert: Alert = session.query(Alert).filter_by(id=alert_id).first()
        if alert is None:
            return JSONResponse(content={"message": "Alert not found"}, status_code=404)

        dt_start_time = datetime.datetime.fromtimestamp(alert_model.start_time)
        dt_end_time = datetime.datetime.fromtimestamp(alert_model.end_time)

        alert = Alert(
            text=alert_model.text,
            start_datetime=dt_start_time,
            end_datetime=dt_end_time,
        )
        session.add(alert)
        session.commit()

    return JSONResponse(content={"message": "OK"})


@router.delete("/{alert_id}")
def delete_alert(req: Request, alert_id: int) -> JSONResponse:
    with req.app.state.db.session() as session:
        alert: Alert = session.query(Alert).filter_by(id=alert_id).first()
        if alert is None:
            return JSONResponse(content={"message": "Alert not found"}, status_code=404)

    return JSONResponse(content={"message": "OK"})
