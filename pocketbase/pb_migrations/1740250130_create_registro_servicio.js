/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "registroServicio",
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
        name: "tipo",
        type: "select",
        required: true,
        options: {
          maxSelect: 1,
          values: ["fotocopia", "plastificado", "souvenir", "otro"],
        },
      },
      {
        name: "descripcion",
        type: "text",
        required: true,
        options: {
          min: null,
          max: null,
          pattern: "",
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
        name: "ingresoTotal",
        type: "number",
        required: true,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "costoInsumos",
        type: "number",
        required: false,
        options: {
          min: null,
          max: null,
        },
      },
      {
        name: "ganancia",
        type: "number",
        required: true,
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
