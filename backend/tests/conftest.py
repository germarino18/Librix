"""Pytest configuration for async tests."""
from typing import AsyncGenerator

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.database import async_session_factory
from app.main import app


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator:
    """Provide a test database session."""
    async with async_session_factory() as session:
        yield session


@pytest_asyncio.fixture
async def async_client() -> AsyncGenerator:
    """Provide an async HTTP client for testing."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
