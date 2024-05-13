from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import delete, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.new.db.alert import AlertModel
from backend.src.new.models.alert import Alert


class InvalidFilterException(Exception):
    def __init__(self, name: str):
        self.name = name


class NotFoundException(Exception):
    def __init__(self, id: str):
        self.id = id


class AlertController:
    async def get_alerts(
        session: AsyncSession, filter: Optional[str] = None
    ) -> List[Alert]:
        now = datetime.now(timezone.utc)

        query = select(AlertModel)
        if filter == "active":
            query = query.where(
                AlertModel.start_datetime <= now, AlertModel.end_datetime >= now
            )
        elif filter == "future":
            query = query.where(AlertModel.start_datetime > now)
        elif filter is not None:
            raise InvalidFilterException(name=filter)

        alerts: List[AlertModel] = await session.execute(query).scalars()

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

    async def get_alert(session: AsyncSession, alert_id: int) -> Alert:
        query = select(AlertModel).filter_by(id=alert_id)
        alert: Alert = await session.execute(query).first()
        if alert is None:
            raise NotFoundException(id=alert_id)
        return alert

    async def create_alert(session: AsyncSession, alert: Alert):
        dt_start_time = datetime.fromtimestamp(alert.start_time, timezone.utc)
        dt_end_time = datetime.fromtimestamp(alert.end_time, timezone.utc)

        new_alert = Alert(
            text=alert.text,
            start_datetime=dt_start_time,
            end_datetime=dt_end_time,
        )
        await session.execute(insert(AlertModel).values(new_alert))

    async def update_alert(session: AsyncSession, alert_id: int, alert: Alert):
        query = select(AlertModel).filter_by(id=alert_id)
        alert: Alert = await session.execute(query).first()
        if alert is None:
            raise NotFoundException(id=alert_id)
        dt_start_time = datetime.fromtimestamp(alert.start_time, timezone.utc)
        dt_end_time = datetime.fromtimestamp(alert.end_time, timezone.utc)

        await session.execute(
            update(AlertModel)
            .where(id=alert_id)
            .values(
                text=alert.text, start_datetime=dt_start_time, end_datetime=dt_end_time
            )
        )

    async def delete_alert(session: AsyncSession, alert_id: int):
        query = select(AlertModel).filter_by(id=alert_id)
        alert: Alert = await session.execute(query).first()
        if alert is None:
            raise NotFoundException(id=alert_id)
        await session.execute(delete(AlertModel).where(id=alert_id))
