"""Insumos — API endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.features.insumos.schemas import (
    InsumoCreate,
    InsumoResponse,
    InsumoUpdate,
    MovimientoCreate,
    MovimientoResponse,
)
from app.features.insumos.service import InsumoService

router = APIRouter(prefix="/api/insumos", tags=["insumos"])


@router.get("", response_model=list[InsumoResponse])
async def list_insumos(db: AsyncSession = Depends(get_db)):
    service = InsumoService(db)
    return await service.list_all()


@router.get("/{id}", response_model=InsumoResponse)
async def get_insumo(id: str, db: AsyncSession = Depends(get_db)):
    service = InsumoService(db)
    result = await service.get_by_id(id)
    if not result:
        raise HTTPException(status_code=404, detail="Insumo no encontrado")
    return result


@router.post("", response_model=InsumoResponse, status_code=201)
async def create_insumo(data: InsumoCreate, db: AsyncSession = Depends(get_db)):
    service = InsumoService(db)
    return await service.create(data.model_dump())


@router.put("/{id}", response_model=InsumoResponse)
async def update_insumo(id: str, data: InsumoUpdate, db: AsyncSession = Depends(get_db)):
    service = InsumoService(db)
    try:
        result = await service.update(id, data.model_dump(exclude_none=True))
        if not result:
            raise HTTPException(status_code=404, detail="Insumo no encontrado")
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{id}", status_code=204)
async def delete_insumo(id: str, db: AsyncSession = Depends(get_db)):
    service = InsumoService(db)
    result = await service.delete(id)
    if not result:
        raise HTTPException(status_code=404, detail="Insumo no encontrado")


@router.post("/{id}/movimientos", response_model=MovimientoResponse, status_code=201)
async def create_movimiento(id: str, data: MovimientoCreate, db: AsyncSession = Depends(get_db)):
    service = InsumoService(db)
    try:
        return await service.create_movimiento(id, data.model_dump())
    except ValueError as e:
        status = 404 if "no encontrado" in str(e) else 400
        raise HTTPException(status_code=status, detail=str(e))


@router.get("/{id}/movimientos", response_model=list[MovimientoResponse])
async def list_movimientos(id: str, db: AsyncSession = Depends(get_db)):
    service = InsumoService(db)
    try:
        return await service.list_movimientos(id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
