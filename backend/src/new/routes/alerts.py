from typing import Dict, List, Optional, Union

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse

from backend.src.new.controllers.AlertController import AlertController
from backend.src.new.ModelException import ModelException
from backend.src.new.models.alert import Alert

router = APIRouter(prefix="/alerts", tags=["alerts"])
controller = AlertController()


@router.get("/")
def get_alerts(
    req: Request, filter: Optional[str] = None
) -> List[Dict[str, Union[str, int]]]:
    """
    ## Get all alerts. Default returns all alerts (past, present, and future)

    **:param filter:** Optional string filter. Valid values are:

        - "active": returns active alerts
        - "future": returns current and future alerts

    **:return:** alerts in format

        - id
        - text
        - startDateTime
        - endDateTime
    """

    alerts_json: List[str] = []
    try:
        for alert in controller.get_alerts(filter):
            alerts_json.append(alert.json())
    except ModelException as error:
        return JSONResponse(content={"message": error}, status_code=error.error_code)

    return alerts_json


@router.get("/{alert_id}")
def get_alert(req: Request, alert_id: int) -> Dict[str, Union[str, int]]:
    """
    ## Get alert with parameter ID.

    **:param alert_id:** Unique integer ID

    **:return:** alert in format

        - id
        - text
        - startDateTime
        - endDateTime
    """
    try:
        return controller.get_alert(alert_id).json()
    except ModelException as error:
        return JSONResponse(content={"message": error}, status_code=error.error_code)


@router.post("/")
def post_alert(req: Request, alert_model: Alert) -> Dict[str, str]:
    """
    ## Create new alert.

    **:param alert_model:** Alert model containing text, start-time, end-time

    **:return:** *"OK"* message
    """
    controller.create_alert(alert_model)

    return {"message": "OK"}


@router.put("/{alert_id}")
def update_alert(req: Request, alert_id: int, alert_model: Alert) -> Dict[str, str]:
    """
    ## Update existing alert of parameter ID.

    **:param alert_id:** Unique integer ID

    **:return:** *"OK"* message
    """
    try:
        controller.update_alert(alert_id, alert_model)
    except ModelException as error:
        return JSONResponse(content={"message": error}, status_code=error.error_code)

    return {"message": "OK"}


@router.delete("/{alert_id}")
def delete_alert(req: Request, alert_id: int) -> Dict[str, str]:
    """
    ## Delete existing alert with parameter ID.

    **:param alert_id:** Unique integer ID

    **:return:** *"OK"* message
    """
    try:
        controller.delete_alert(alert_id)
    except ModelException as error:
        return JSONResponse(content={"message": error}, status_code=error.error_code)

    return {"message": "OK"}
