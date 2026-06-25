/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "caja",
    type: "base",
    system: false,
    schema: [
      {
        name: "fecha",
        type: "date",
        required: true,
        options: {
          min: "",
          max: "",
        },
      },
      {
        name: "montoInicial",
        type: "number",
        required: true,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "montoFinal",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "estado",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["abierta", "cerrada"],
        },
      },
      {
        name: "totalEfectivo",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "totalTransferencia",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "totalQR",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "totalServicios",
        type: "number",
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
