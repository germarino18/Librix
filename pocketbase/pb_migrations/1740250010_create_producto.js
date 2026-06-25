/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "producto",
    type: "base",
    system: false,
    schema: [
      {
        name: "nombre",
        type: "text",
        required: true,
        unique: false,
        options: {
          min: null,
          max: null,
          pattern: "",
        },
      },
      {
        name: "precioCompra",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "precioVenta",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "stockActual",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "stockMinimo",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "unidad",
        type: "text",
        required: false,
        options: {
          min: null,
          max: null,
          pattern: "",
        },
      },
      {
        name: "activo",
        type: "bool",
        required: false,
        options: {},
      },
      {
        name: "categoria_id",
        type: "relation",
        required: false,
        options: {
          collectionId: null,
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: [],
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
