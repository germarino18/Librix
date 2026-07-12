"""Servicios — API endpoints."""
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.features.servicios.models import TipoServicio
from app.features.servicios.schemas import RegistroServicioCreate, RegistroServicioResponse
from app.features.servicios.service import ServicioService

router = APIRouter(prefix="/api/servicios", tags=["servicios"])


@router.get("", response_model=list[RegistroServicioResponse])
async def list_servicios(
    fecha: Optional[date] = Query(None),
    tipo: Optional[TipoServicio] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    service = ServicioService(db)
    return await service.list_all(fecha=fecha, tipo=tipo)


@router.get("/{id}", response_model=RegistroServicioResponse)
async def get_servicio(id: str, db: AsyncSession = Depends(get_db)):
    service = ServicioService(db)
    result = await service.get_by_id(id)
    if not result:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return result


@router.post("", response_model=RegistroServicioResponse, status_code=201)
async def create_servicio(data: RegistroServicioCreate, db: AsyncSession = Depends(get_db)):
    service = ServicioService(db)
    return await service.create(data.model_dump())


@router.delete("/{id}", status_code=204)
async def delete_servicio(id: str, db: AsyncSession = Depends(get_db)):
    service = ServicioService(db)
    result = await service.delete(id)
    if not result:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
