const express = require("express");
const router = express.Router();
//const handleMulterError = require("../middlewares/multerError");
const auth = require("../middlewares/authentication")
const upload = require("../utils/Upload");
const labcontroler = require("../controllers/LabController");

router.post(`/lab`,upload.single("file"),labcontroler.addLab);
router.post(`/evaluate`,auth(),labcontroler.addSolvedlab);
router.post(`/updatelabstatus`,auth(),labcontroler.updateSolvedlab);
module.exports = router;
