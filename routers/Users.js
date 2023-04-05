const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const AuthMW = require("../middlewares/AuthMW");
const {
  validatorMiddleware,
  getCurrentUser,
} = require("../middlewares/UserMW");

router.get("/", UserController.getAll);
router.post("/register", validatorMiddleware, UserController.register);
router.patch("/update", UserController.updateUser);
router.post("/login", AuthMW, UserController.login);
router.get("/profile", getCurrentUser, (req, res) => {
  res.json({ name: req.user.firstName });
});
module.exports = router;
