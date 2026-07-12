import { useMemo } from "react"
import type { TipoServicio } from "../types/serviciosTypes"

interface CalculoInput {
  tipo: TipoServicio
  cantidad: number
  precioUnitario: number
  ingresoTotalManual: number
  costoInsumos: number
}

interface CalculoResultado {
  ingresoCalculado: number
  gananciaEstimada: number
}

export function useCalculoServicio(input: CalculoInput): CalculoResultado {
  const { tipo, cantidad, precioUnitario, ingresoTotalManual, costoInsumos } = input

  return useMemo(() => {
    let ingresoCalculado = ingresoTotalManual

    if (tipo === "fotocopia" || tipo === "plastificado") {
      ingresoCalculado = cantidad * precioUnitario
    }

    const gananciaEstimada = ingresoCalculado - costoInsumos

    return { ingresoCalculado, gananciaEstimada }
  }, [tipo, cantidad, precioUnitario, ingresoTotalManual, costoInsumos])
}
