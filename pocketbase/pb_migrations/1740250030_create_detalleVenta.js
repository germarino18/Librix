/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "detalleVenta",
    type: "base",
    system: false,
    schema: [
      {
        name: "venta_id",
        type: "relation",
        required: true,
        options: {
          collectionId: null,
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: [],
        },
      },
      {
        name: "producto_id",
        type: "relation",
        required: true,
        options: {
          collectionId: null,
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: [],
        },
      },
      {
        name: "cantidad",
        type: "number",
        required: true,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "precioUnitario",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "subtotal",
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
