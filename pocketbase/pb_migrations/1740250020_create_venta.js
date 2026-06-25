/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "venta",
    type: "base",
    system: false,
    schema: [
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
        name: "total",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "metodoPago",
        type: "select",
        required: false,
        options: {
          maxSelect: 1,
          values: ["efectivo", "transferencia", "qr_mercadopago"],
        },
      },
      {
        name: "estado",
        type: "select",
        required: false,
        options: {
          maxSelect: 1,
          values: ["completada", "cancelada"],
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
