const mongoose = require("mongoose");

const LabsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    Containers: { type: String },
    numberofsolving: { type: Number, default: 0 },
    Diffculty: { type: String, default: "easy" },
    Flag: { type: String, required: true },
  },

  { timestamps: true }
);

const LabsModel = mongoose.model("Labs", LabsSchema);

module.exports = LabsModel;
