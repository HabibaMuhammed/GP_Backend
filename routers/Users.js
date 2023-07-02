const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const AuthMW = require("../middlewares/AuthMW");
const {
  validatorMiddleware,
  getCurrentUser,
} = require("../middlewares/UserMW");
const isAdminMW = require("../middlewares/AdminMW");
router.post("/register", validatorMiddleware, UserController.register);
router.patch("/update", getCurrentUser, UserController.updateUser);
router.patch("/updatePassword", getCurrentUser, UserController.updatePassword);
router.post("/login", AuthMW, UserController.login);
router.get("/profile", getCurrentUser,(req, res) => {
  res.json({ name: req.user.firstName });
});
router.delete("/Delete", getCurrentUser, UserController.deleteUser);
router.get("/Recentlabs", getCurrentUser, UserController.fetchRecentChallenges);
router.get("/Performance", getCurrentUser, UserController.Performance);
router.patch("/sendCode" , UserController.sendCode)
router.post("/Verified" , UserController.validateAuthcode)
router.patch("/forgetPassword" , UserController.forgetPassword)
module.exports = router;
