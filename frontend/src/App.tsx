import { Routes, Route } from "react-router-dom"
import Layout from "@/components/Layout"
import VentasPage from "@/features/ventas/pages/VentasPage"
import ProductosPage from "@/features/productos/pages/ProductosPage"
import InsumosPage from "@/features/insumos/pages/InsumosPage"
import ServiciosPage from "@/features/servicios/pages/ServiciosPage"
import CajaPage from "@/features/caja/pages/CajaPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<VentasPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="insumos" element={<InsumosPage />} />
        <Route path="servicios" element={<ServiciosPage />} />
        <Route path="caja" element={<CajaPage />} />
      </Route>
    </Routes>
  )
}
