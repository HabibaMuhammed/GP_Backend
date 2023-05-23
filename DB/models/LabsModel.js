const mongoose = require("mongoose");

const LabsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    Containers: { type: String },
    numberofsolving: { type: Number, default: 0 },
    Diffculty: { type: String, default: "easy" },
    Flag: { type: String, required: true },
    icon: {type:String},
    header1: {type:String},
    header1content:{type:String},
    header2: {type:String},
    header2content:{type:String},
    header3: {type:String},
    header3content:{type:String}, 
    header4: {type:String},
    header4content:{type:String},
  },

  { timestamps: true }
);

const LabsModel = mongoose.model("Labs", LabsSchema);

module.exports = LabsModel;
