import { Link, Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center gap-6 px-6">
          <Link to="/" className="text-lg font-semibold">
            Librix
          </Link>
          <nav className="flex gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Ventas
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link to="/productos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Productos
            </Link>
            <Link to="/insumos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Insumos
            </Link>
            <Link to="/servicios" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Servicios
            </Link>
            <Link to="/caja" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Caja
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6 min-h-0">
        <Outlet />
      </main>
    </div>
  )
}
