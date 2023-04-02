const Ajv = require("ajv").default;
const ajv = new Ajv();

const Schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    password: { type: "string", minLength: 8 },
  },
  required: ["email", "password"],
};
module.exports = ajv.compile(Schema);
