const mongoose = require("mongoose");

const LabsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    Containers: { type: String },
    numberofsolving: { type: Number, default: 0 },
    Diffculty: { type: String, default: "easy" },
    Flag: { type: String, required: true },
    icon: { type: String },
    headers: [{ type: mongoose.Schema.Types.String, default: [] }],
    headers_content: [{ type: mongoose.Schema.Types.String, default: [] }],
  },

  { timestamps: true }
);

const LabsModel = mongoose.model("Labs", LabsSchema);

module.exports = LabsModel;
