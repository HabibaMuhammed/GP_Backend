const mongoose = require("mongoose");

const connect_DB = async () => {
  return await mongoose
    .connect('mongodb://localhost:27017')
    .then(() => {
      console.log(process.env.DATABASE_URI);
      console.log("Database Connected Successfuly");
    })
    .catch(() => {
      console.log("Connection Failed");
    });
};

module.exports = connect_DB;
