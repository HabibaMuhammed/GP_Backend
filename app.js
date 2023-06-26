const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const usersRouter = require("./routers/Users");
const labroute = require("./routers/lab");
const adminroute = require("./routers/Admin");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use("/Container", express.static("./Container"));
app.use("/Labsicon", express.static("./Labsicon"));
const connect_DB = require("./DB/Connection");
connect_DB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", usersRouter);

app.use("/api/labs", labroute);
app.use("/api/admin", adminroute);
app.listen(5001, () => console.log("Listening on port 5001"));
