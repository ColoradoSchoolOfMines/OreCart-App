import struct
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock

import pytest

from src.handlers.ridership import post_ridership_stats
from src.hardware import HardwareErrorCode, HardwareHTTPException, HardwareOKResponse
from src.model.analytics import Analytics
from src.model.route import Route
from src.model.van import Van


@pytest.fixture
def mock_van_model():
    return Van(id=1, route_id=1, wheelchair=False)


def new_mock_ridership(time: datetime):
    return Analytics(
        van_id=1,
        route_id=1,
        entered=5,
        exited=3,
        lat=37.7749,
        lon=-122.4194,
        datetime=time,
    )


def mock_analytics_body(analytics: Analytics, time: datetime):
    async def inner():
        return struct.pack(
            "!lbbdd",
            int(time.timestamp()),
            analytics.entered,
            analytics.exited,
            analytics.lat,
            analytics.lon,
        )

    return inner


@pytest.mark.asyncio
async def test_post_ridership_stats_with_prior(mock_route_args, mock_van_model):
    # Arrange
    now = datetime.now(timezone.utc).replace(microsecond=0)
    prior_ridership = new_mock_ridership(now - timedelta(minutes=1))
    new_ridership = new_mock_ridership(now)
    mock_route_args.req.body = mock_analytics_body(new_ridership, now)
    mock_route_args.session.add(mock_van_model)
    mock_route_args.session.add(prior_ridership)
    mock_route_args.session.commit()

    # Act
    response = await post_ridership_stats(mock_route_args.req, mock_van_model.id)

    # Assert
    assert response == HardwareOKResponse()
    assert mock_route_args.session.query(Analytics).filter_by(datetime=now).count() > 0


@pytest.mark.asyncio
async def test_post_ridership_stats_without_prior(mock_route_args, mock_van_model):
    # Arrange
    now = datetime.now(timezone.utc).replace(microsecond=0)
    new_ridership = new_mock_ridership(now)
    mock_route_args.req.body = mock_analytics_body(new_ridership, now)
    mock_route_args.session.add(mock_van_model)
    mock_route_args.session.commit()

    # Act
    response = await post_ridership_stats(mock_route_args.req, mock_van_model.id)

    # Assert
    assert response == HardwareOKResponse()
    assert mock_route_args.session.query(Analytics).filter_by(datetime=now).count() > 0


@pytest.mark.asyncio
async def test_post_ridership_stats_too_far_in_past(mock_route_args, mock_van_model):
    # Arrange
    now = datetime.now(timezone.utc).replace(microsecond=0) - timedelta(minutes=2)
    new_ridership = new_mock_ridership(now)
    mock_route_args.req.body = mock_analytics_body(new_ridership, now)
    mock_route_args.session.add(mock_van_model)
    mock_route_args.session.commit()

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(mock_route_args.req, mock_van_model.id)

    # Assert
    assert e.value.status_code == 400
    assert e.value.error_code == HardwareErrorCode.TIMESTAMP_TOO_FAR_IN_PAST
    assert mock_route_args.session.query(Analytics).filter_by(datetime=now).count() == 0


@pytest.mark.asyncio
async def test_post_ridership_stats_in_future(mock_route_args, mock_van_model):
    # Arrange
    now = datetime.now(timezone.utc).replace(microsecond=0) + timedelta(minutes=2)
    new_ridership = new_mock_ridership(now)
    mock_route_args.req.body = mock_analytics_body(new_ridership, now)
    mock_route_args.session.add(mock_van_model)
    mock_route_args.session.commit()

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(mock_route_args.req, mock_van_model.id)

    # Assert
    assert e.value.status_code == 400
    assert e.value.error_code == HardwareErrorCode.TIMESTAMP_IN_FUTURE
    assert mock_route_args.session.query(Analytics).filter_by(datetime=now).count() == 0


@pytest.mark.asyncio
async def test_post_ridership_van_not_active_invalid_param(
    mock_route_args, mock_van_model
):
    # Arrange
    now = datetime.now(timezone.utc).replace(microsecond=0)
    new_ridership = new_mock_ridership(now)
    mock_route_args.req.body = mock_analytics_body(new_ridership, now)
    mock_route_args.session.add(mock_van_model)
    mock_route_args.session.commit()

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(mock_route_args.req, 16)

    # Assert
    assert e.value.status_code == 404
    assert e.value.error_code == HardwareErrorCode.VAN_NOT_ACTIVE
    assert mock_route_args.session.query(Analytics).filter_by(datetime=now).count() == 0


@pytest.mark.asyncio
async def test_post_ridership_van_not_active_valid_param(mock_route_args):
    # Arrange
    now = datetime.now(timezone.utc).replace(microsecond=0)
    new_ridership = new_mock_ridership(now)
    mock_route_args.req.body = mock_analytics_body(new_ridership, now)

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(mock_route_args.req, 1)

    # Assert
    assert e.value.status_code == 404
    assert e.value.error_code == HardwareErrorCode.VAN_NOT_ACTIVE
    assert mock_route_args.session.query(Analytics).filter_by(datetime=now).count() == 0


@pytest.mark.asyncio
async def test_post_ridership_stats_not_most_recent(mock_route_args, mock_van_model):
    # Arrange
    now = datetime.now(timezone.utc).replace(microsecond=0)
    new_ridership = new_mock_ridership(now)
    prior_ridership = new_mock_ridership(now + timedelta(minutes=1))
    mock_route_args.req.body = mock_analytics_body(new_ridership, now)
    mock_route_args.session.add(mock_van_model)
    mock_route_args.session.add(prior_ridership)
    mock_route_args.session.commit()

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(mock_route_args.req, mock_van_model.id)

    # Assert
    assert e.value.status_code == 400
    assert e.value.error_code == HardwareErrorCode.TIMESTAMP_NOT_MOST_RECENT
    assert mock_route_args.session.query(Analytics).filter_by(datetime=now).count() == 0
