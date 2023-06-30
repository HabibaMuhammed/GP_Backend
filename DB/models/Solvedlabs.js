const mongoose = require("mongoose");

const SolvedlabsSchema = new mongoose.Schema(
  {
    lab_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Labs",
      required: true,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    Status: { type: String, required: true, default: "Unsolved" },
    time:{type:String}
  },

  { timestamps: true }
);

const SolvedlabsModel = mongoose.model("SolvedLabs", SolvedlabsSchema);

module.exports = SolvedlabsModel;
