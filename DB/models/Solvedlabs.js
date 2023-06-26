const mongoose = require("mongoose");

const SolvedlabsSchema = new mongoose.Schema(
  {
     lab_id:{type: mongoose.Schema.Types.ObjectId, ref: "Labs", required: true},

     user_id:{type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
     Status: { type: String, required: true,default:"Unsolved" },
     time_stamps:{type:Date,default:new Date()}
  },

  
);

const SolvedlabsModel = mongoose.model("SolvedLabs", SolvedlabsSchema);

module.exports=SolvedlabsModel