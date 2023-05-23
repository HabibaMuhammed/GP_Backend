const mongoose = require("mongoose");
const valid = require("validator");

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (val) => {
        return valid.isEmail(val);
      },
      message: "{VALUE} is not valid email",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (val) => {
        return valid.isStrongPassword(val);
      },
      message: "{VALUE} is not a strong password",
    },
  },
  Location:{
    type: String,
   },
   Birthday:{
    type:String,
   },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//const User = mongoose.model("Users", userSchema);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
