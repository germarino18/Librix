/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    name: "categoria",
    type: "base",
    system: false,
    schema: [
      {
        name: "nombre",
        type: "text",
        required: true,
        unique: true,
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
