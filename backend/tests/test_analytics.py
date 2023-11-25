import struct
from datetime import datetime, timedelta
from unittest.mock import MagicMock

import pytest
from src.handlers.analytics import post_ridership_stats
from src.hardware import HardwareErrorCode, HardwareHTTPException, HardwareOKResponse
from src.model.analytics import Analytics
from src.model.van import Van


@pytest.fixture
def mock_session():
    mock = MagicMock()
    mock.__enter__.return_value = mock
    mock.__exit__.return_value = False
    return mock


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


def new_mock_req(time: datetime, ridership: MagicMock, session: MagicMock):
    async def mock_body():
        return struct.pack(
            "!lbbdd",
            int(time.timestamp()),
            ridership.entered,
            ridership.exited,
            ridership.lat,
            ridership.lon,
        )

    req = MagicMock()
    req.body = mock_body
    req.app.state.db.session.return_value = session
    return req


def new_route_side_effect(van_model, ridership):
    def route_side_effect(*args):
        # Create different mock query objects for each model
        if args[0] is Van:
            mock_query = MagicMock()
            mock_query.filter_by.return_value.first.return_value = van_model
            return mock_query

        if args[0] is Analytics:
            mock_query = MagicMock()
            mock_query.filter_by.return_value.order_by.return_value.first.return_value = (
                ridership
            )
            return mock_query

        raise TypeError("Invalid model type")

    return route_side_effect


@pytest.mark.asyncio
async def test_post_ridership_stats_with_prior(mock_session, mock_van_model):
    # Arrange
    now = datetime.now().replace(microsecond=0)
    new_ridership = new_mock_ridership(now)
    req = new_mock_req(now, new_ridership, mock_session)
    prior_ridership = new_mock_ridership(now - timedelta(minutes=1))
    mock_session.query.side_effect = new_route_side_effect(
        mock_van_model, prior_ridership
    )

    # Act
    response = await post_ridership_stats(req, mock_van_model.id)

    # Assert
    assert response == HardwareOKResponse()
    mock_session.add.assert_called_once_with(new_ridership)
    mock_session.commit.assert_called_once()


@pytest.mark.asyncio
async def test_post_ridership_stats_without_prior(mock_session, mock_van_model):
    # Arrange
    now = datetime.now().replace(microsecond=0)
    new_ridership = new_mock_ridership(now)
    req = new_mock_req(now, new_ridership, mock_session)
    mock_session.query.side_effect = new_route_side_effect(mock_van_model, None)

    # Act
    response = await post_ridership_stats(req, mock_van_model.id)

    # Assert
    assert response == HardwareOKResponse()
    mock_session.add.assert_called_once_with(new_ridership)
    mock_session.commit.assert_called_once()


@pytest.mark.asyncio
async def test_post_ridership_stats_too_far_in_past(mock_session, mock_van_model):
    # Arrange
    now = datetime.now().replace(microsecond=0) - timedelta(minutes=2)
    new_ridership = new_mock_ridership(now)
    req = new_mock_req(now, new_ridership, mock_session)
    mock_session.query.side_effect = new_route_side_effect(mock_van_model, None)

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(req, mock_van_model.id)

    # Assert
    assert e.value.status_code == 400
    assert e.value.error_code == HardwareErrorCode.TIMESTAMP_TOO_FAR_IN_PAST
    mock_session.add.not_assert_called_once_with(new_ridership)


@pytest.mark.asyncio
async def test_post_ridership_stats_in_future(mock_session, mock_van_model):
    # Arrange
    now = datetime.now().replace(microsecond=0) + timedelta(minutes=2)
    new_ridership = new_mock_ridership(now)
    req = new_mock_req(now, new_ridership, mock_session)
    mock_session.query.side_effect = new_route_side_effect(mock_van_model, None)

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(req, mock_van_model.id)

    # Assert
    assert e.value.status_code == 400
    assert e.value.error_code == HardwareErrorCode.TIMESTAMP_IN_FUTURE
    mock_session.add.not_assert_called_once_with(new_ridership)


@pytest.mark.asyncio
async def test_post_ridership_van_not_active_invalid_param(
    mock_session, mock_van_model
):
    # Arrange
    now = datetime.now().replace(microsecond=0)
    new_ridership = new_mock_ridership(now)
    req = new_mock_req(now, new_ridership, mock_session)
    mock_session.query.side_effect = new_route_side_effect(None, mock_van_model)

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(req, 16)

    # Assert
    assert e.value.status_code == 404
    assert e.value.error_code == HardwareErrorCode.VAN_NOT_ACTIVE
    mock_session.add.not_assert_called_once_with(new_ridership)


@pytest.mark.asyncio
async def test_post_ridership_van_not_active_valid_param(mock_session):
    # Arrange
    now = datetime.now().replace(microsecond=0)
    new_ridership = new_mock_ridership(now)
    req = new_mock_req(now, new_ridership, mock_session)
    mock_session.query.side_effect = new_route_side_effect(None, None)

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(req, 1)

    # Assert
    assert e.value.status_code == 404
    assert e.value.error_code == HardwareErrorCode.VAN_NOT_ACTIVE
    mock_session.add.not_assert_called_once_with(new_ridership)


@pytest.mark.asyncio
async def test_post_ridership_stats_not_most_recent(mock_session, mock_van_model):
    # Arrange
    now = datetime.now().replace(microsecond=0)
    new_ridership = new_mock_ridership(now)
    req = new_mock_req(now, new_ridership, mock_session)
    prior_ridership = new_mock_ridership(now + timedelta(minutes=1))
    mock_session.query.side_effect = new_route_side_effect(
        mock_van_model, prior_ridership
    )

    # Act
    with pytest.raises(HardwareHTTPException) as e:
        await post_ridership_stats(req, mock_van_model.id)

    # Assert
    assert e.value.status_code == 400
    assert e.value.error_code == HardwareErrorCode.TIMESTAMP_NOT_MOST_RECENT
    mock_session.add.not_assert_called_once_with(new_ridership)
