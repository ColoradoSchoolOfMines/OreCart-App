import datetime

from fastapi import APIRouter, Request
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
def get_alerts(req: Request, active: bool = False) -> JSONResponse:
    with req.app.state.db.session() as session:
        query = session.query(Alert)
        if active:
            now = datetime.datetime.now()
            query = query.filter(Alert.start_datetime <= now, Alert.end_datetime >= now)
        alerts = query.all()

    alerts_json = []
    for alert in alerts:
        alert_json = {
            "text": alert.text,
            "startDateTime": str(alert.start_datetime),
            "endDateTime": str(alert.end_datetime),
        }
        alerts_json.append(alert_json)

    return JSONResponse(content=alerts_json)


@router.get("/{alert_id}")
def get_alert(req: Request, alert_id: int) -> JSONResponse:
    with req.app.state.db.session() as session:
        alert: Alert = session.query(Alert).filter_by(id=alert_id).first()
        if alert is None:
            return JSONResponse(content={"message": "Alert not found"}, status_code=404)

    alert_json = {
        "text": alert.text,
        "startDateTime": str(alert.start_datetime),
        "endDateTime": str(alert.end_datetime),
    }

    return JSONResponse(content=alert_json)


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
