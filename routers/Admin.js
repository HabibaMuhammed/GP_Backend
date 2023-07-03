const express = require("express");
const router = express.Router();
const handleMulterError1= require("../middlewares/multerErrorImage");
const handleMulterError2= require("../middlewares/multerErrorContainer");
const Uploadcontainer = require("../utils/Uploadcontainer");
const Uploadimage= require("../utils/Uploadimage");
const labcontroler = require("../controllers/AdminController");
const {
  getCurrentUser,
} = require("../middlewares/UserMW");
const isAdminMW = require("../middlewares/AdminMW");
router.post(`/labname`, Uploadimage.single("icon"),handleMulterError1,labcontroler.addLab);
router.post(`/labcontent`,Uploadcontainer.single("file"),handleMulterError2, labcontroler.addLabcontent);
router.get("/Getlabs", getCurrentUser, isAdminMW,labcontroler.getlabs);
router.delete("/Deletelab",getCurrentUser, isAdminMW,labcontroler.deletelab);
module.exports = router;