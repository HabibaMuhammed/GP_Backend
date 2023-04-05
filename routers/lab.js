const express = require("express");
const router = express.Router();
//const handleMulterError = require("../middlewares/multerError");
const auth = require("../middlewares/authentication");
const Uploadcontainer = require("../utils/Uploadcontainer");
const Uploadimage= require("../utils/Uploadimage");
const labcontroler = require("../controllers/LabController");

router.post(`/lab`, Uploadimage.single("icon"), labcontroler.addLab);
router.post(`/labcontent`, Uploadcontainer.single("file"), labcontroler.addLabcontent);
router.post(`/evaluate`, auth(), labcontroler.addSolvedlab);
router.post(`/updatelabstatus`, auth(), labcontroler.updateSolvedlab);
router.get(`/number`, auth(), labcontroler.numberOfSolvedLabs);

module.exports = router;
