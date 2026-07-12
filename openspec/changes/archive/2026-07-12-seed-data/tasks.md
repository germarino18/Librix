## 1. Script scaffold

- [x] 1.1 Crear carpeta `backend/seeds/`
- [x] 1.2 Crear `backend/seeds/seed.py` con estructura async básica: config de BD, creación de engine, función main()

## 2. Categorías

- [x] 2.1 Definir lista de categorías (Escritura, Papelería, Carpetas y Archivos, Corrección, Adhesivos, Varios)
- [x] 2.2 Implementar inserción de categorías con limpieza previa

## 3. Productos

- [x] 3.1 Definir lista completa de productos (~30-40 items) con datos realistas: nombre, precioCompra, precioVenta, stockActual, stockMinimo, unidad, categoria
- [x] 3.2 Implementar inserción de productos con IDs de categoría correctos
- [x] 3.3 Verificar márgenes de ganancia entre 20% y 40%

## 4. Insumos de servicios

- [x] 4.1 Definir insumos: Resma A4 (500 hojas), Cartucho tóner negro, Cartucho tóner color
- [x] 4.2 Implementar inserción de insumos con stock, costoUnitario y páginasPorUnidad

## 5. Idempotencia y finalización

- [x] 5.1 Implementar limpieza ordenada de tablas al inicio (orden inverso de dependencias)
- [x] 5.2 Agregar mensajes de progreso en consola
- [x] 5.3 Probar ejecución: `python backend/seeds/seed.py` desde raíz o `python seeds/seed.py` desde backend/
