from datetime import datetime, timezone
from typing import Any
from unittest.mock import MagicMock

import pytest
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from src.db.base import Base


class MockRouteArgs:
    def __init__(
        self,
        req,
        session,
    ) -> None:
        self.req = req
        self.session = session


@pytest.fixture
def mock_session():
    engine = create_async_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = async_sessionmaker(bind=engine)
    return Session()


@pytest.fixture
def mock_route_args(mock_session) -> MockRouteArgs:
    mock_req = MagicMock()
    mock_req.app.state.db.session.return_value = mock_session
    return MockRouteArgs(session=mock_session, req=mock_req)


@pytest.fixture
def mock_datetime():
    return datetime.fromtimestamp(1691623800, timezone.utc)
