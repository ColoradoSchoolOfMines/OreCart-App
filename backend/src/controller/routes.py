from abc import ABC, abstractmethod
from typing import List
from typing_extensions import Self, Optional, Dict, Any

from src.model.route import Route, Stop

from sqlalchemy.ext.asyncio import AsyncSession


class RoutesController(ABC):
    @abstractmethod
    async def get_routes(
        self: Self,
        session: AsyncSession,
        stops: Optional[Dict[str, Any]] = None,
        waypoints: bool = False,
        is_active: bool = False,
    ) -> List[Route]:
        pass

    @abstractmethod
    async def get_route(
        self: Self,
        id_: int,
        session: AsyncSession,
        stops: Optional[Dict[str, Any]] = None,
        waypoints: bool = False,
        is_active: bool = False,
    ) -> Optional[Route]:
        pass
