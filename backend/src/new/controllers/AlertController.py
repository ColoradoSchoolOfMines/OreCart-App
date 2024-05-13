from datetime import datetime, timezone
from typing import List, Optional

from flask import app

from backend.src.new.db.alert import AlertModel
from backend.src.new.ModelException import ModelException
from backend.src.new.models.alert import Alert


class AlertController:
    def get_alerts(filter: Optional[str] = None) -> List[Alert]:
        with app.state.db.session() as session:
            query = session.query(AlertModel)
            if filter == "active":
                now = datetime.now(timezone.utc)
                query = query.filter(
                    AlertModel.start_datetime <= now, AlertModel.end_datetime >= now
                )
            elif filter == "future":
                now = datetime.now(timezone.utc)
                query = query.filter(AlertModel.start_datetime > now)
            elif filter is not None:
                raise ModelException(message=f"Invalid filter {filter}", error_code=400)
            alerts: List[AlertModel] = query.all()

        returned_alerts: List[Alert] = []
        for alert in alerts:
            returned_alerts.append(
                Alert(
                    id=alert.id,
                    text=alert.text,
                    startDateTime=int(
                        alert.start_datetime.timestamp(),
                        endDateTime=int(alert.end_datetime.timestamp()),
                    ),
                )
            )

        return returned_alerts

    def get_alert(alert_id: int) -> Alert:
        with app.state.db.session() as session:
            alert: Alert = session.query(AlertModel).filter_by(id=alert_id).first()
            if alert is None:
                raise ModelException(message="Alert not found", error_code=404)
        return alert

    def create_alert(alert_json: Alert):
        with app.state.db.session() as session:
            dt_start_time = datetime.fromtimestamp(alert_json.start_time, timezone.utc)
            dt_end_time = datetime.fromtimestamp(alert_json.end_time, timezone.utc)

            alert = Alert(
                text=alert_json.text,
                start_datetime=dt_start_time,
                end_datetime=dt_end_time,
            )
            session.add(alert)
            session.commit()

    def update_alert(alert_id: int, alert_json: Alert):
        with app.state.db.session() as session:
            alert: Alert = session.query(AlertModel).filter_by(id=alert_id).first()
            if alert is None:
                raise ModelException(message="Alert not found", error_code=404)
            dt_start_time = datetime.fromtimestamp(alert_json.start_time, timezone.utc)
            dt_end_time = datetime.fromtimestamp(alert_json.end_time, timezone.utc)

            alert.text = alert_json.text
            alert.start_datetime = dt_start_time
            alert.end_datetime = dt_end_time
            session.commit()

    def delete_alert(alert_id: int):
        with app.state.db.session() as session:
            alert: Alert = session.query(AlertModel).filter_by(id=alert_id).first()
            if alert is None:
                raise ModelException(message="Alert not found", error_code=404)
            session.query(AlertModel).filter_by(id=alert_id).delete()
            session.commit()
