/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "insumoServicio",
    type: "base",
    system: false,
    schema: [
      {
        name: "nombre",
        type: "text",
        required: true,
        options: {
          min: null,
          max: null,
          pattern: "",
        },
      },
      {
        name: "stockActual",
        type: "number",
        required: true,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "unidad",
        type: "text",
        required: true,
        options: {
          min: null,
          max: null,
          pattern: "",
        },
      },
      {
        name: "costoUnitario",
        type: "number",
        required: true,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "stockMinimo",
        type: "number",
        required: true,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "paginasPorUnidad",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
    ],
    indexes: [],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });
  return app.save(collection);
})
