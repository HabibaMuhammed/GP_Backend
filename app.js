const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const usersRouter = require("./routers/Users");
const labroute = require("./routers/lab");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.urlencoded({ extended: false }));
app.use("/Container", express.static("./Container"));
const connect_DB = require("./DB/Connection");
connect_DB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", usersRouter);

app.use("/api/labs", labroute);
app.listen(process.env.PORT, () => console.log("Listening on port 5001"));
