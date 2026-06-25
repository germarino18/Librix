/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "movimientoStock",
    type: "base",
    system: false,
    schema: [
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
        name: "tipo",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["ingreso", "venta", "ajuste"],
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
        name: "fechaHora",
        type: "autodate",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "observacion",
        type: "text",
        required: false,
        options: {
          min: null,
          max: null,
          pattern: "",
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
