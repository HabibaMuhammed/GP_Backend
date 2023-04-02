const mongoose = require("mongoose");

const connect_DB = async () => {
  return await mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
      console.log(process.env.DATABASE_URI);
      console.log("Database Connected Successfuly");
    })
    .catch(() => {
      console.log("Connection Failed");
    });
};

module.exports = connect_DB;
