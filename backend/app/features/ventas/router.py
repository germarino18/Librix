"""Ventas — API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.features.ventas.schemas import VentaCreate, VentaListResponse, VentaResponse
from app.features.ventas.service import VentaService

router = APIRouter(prefix="/api/ventas", tags=["ventas"])


@router.get("", response_model=VentaListResponse)
async def list_ventas(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = VentaService(db)
    return await service.list(page=page, per_page=per_page)


@router.post("", response_model=VentaResponse, status_code=201)
async def create_venta(data: VentaCreate, db: AsyncSession = Depends(get_db)):
    service = VentaService(db)
    try:
        return await service.create(data.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{id}", response_model=VentaResponse)
async def get_venta(id: str, db: AsyncSession = Depends(get_db)):
    service = VentaService(db)
    result = await service.get_by_id(id)
    if not result:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return result
