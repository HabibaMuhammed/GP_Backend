const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const usersRouter = require("./routers/Users");
const labroute = require("./routers/lab");
const adminroute = require("./routers/Admin");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const csrf = require('csurf');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});

app.use(limiter);
dotenv.config();
app.use(cors());
const csrfProtection = csrf({ cookie: true});

app.get('/csrf', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})
app.use(express.urlencoded({ extended: false }));
app.use("/Container", express.static("./Container"));
app.use("/Labsicon", express.static("./Labsicon"));

const connect_DB = require("./DB/Connection");
connect_DB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(mongoSanitize());

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

app.use(
  mongoSanitize({
    allowDots: true,
  })
);

app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: "_",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", usersRouter);

app.use("/api/labs", labroute);
app.use("/api/admin", adminroute);
app.listen(5001, () => console.log("Listening on port 5001"));
