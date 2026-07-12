"""Caja — API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.features.caja.schemas import (
    CajaCierre,
    CajaCreate,
    CajaHistorialResponse,
    CajaResponse,
)
from app.features.caja.service import CajaService

router = APIRouter(prefix="/api/caja", tags=["caja"])


@router.post("/abrir", response_model=CajaResponse, status_code=201)
async def abrir_caja(data: CajaCreate, db: AsyncSession = Depends(get_db)):
    service = CajaService(db)
    return await service.abrir(
        monto_inicial=data.monto_inicial,
        observacion=data.observacion,
    )


@router.post("/cerrar", response_model=CajaResponse)
async def cerrar_caja(data: CajaCierre, db: AsyncSession = Depends(get_db)):
    service = CajaService(db)
    return await service.cerrar(observacion=data.observacion)


@router.get("/actual", response_model=CajaResponse)
async def get_caja_actual(db: AsyncSession = Depends(get_db)):
    service = CajaService(db)
    caja = await service.get_actual()
    if not caja:
        raise HTTPException(
            status_code=404, detail="No hay caja para el día de hoy"
        )
    return caja


@router.get("/historial", response_model=CajaHistorialResponse)
async def get_historial(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = CajaService(db)
    items, total = await service.list_historial(skip=skip, limit=limit)
    return CajaHistorialResponse(total=total, items=items)


@router.get("/{id}", response_model=CajaResponse)
async def get_caja_by_id(id: str, db: AsyncSession = Depends(get_db)):
    service = CajaService(db)
    caja = await service.get_by_id(id)
    if not caja:
        raise HTTPException(status_code=404, detail="Caja no encontrada")
    return caja
