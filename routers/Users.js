const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const AuthMW = require("../middlewares/AuthMW");
const UsersValidator = require("../middlewares/UserMW");

router.get("/", UserController.getAll);
router.post("/register", UsersValidator, UserController.register);
router.patch("/update", UserController.updateUser);
router.post("/login", AuthMW, UserController.login);
module.exports = router;
