const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authentication");
const labcontroler = require("../controllers/LabController");

//user
router.post(`/evaluate`, auth(),labcontroler.addSolvedlab);
router.post(`/updatelabstatus`, auth(), labcontroler.updateSolvedlab);
router.get(`/number`, auth(), labcontroler.numberOfSolvedLabs);
router.get("/Fetchlabs", labcontroler.Fetchlabs);
router.post("/Fetchlab", labcontroler.Fetchonelab);
router.post("/Search", labcontroler.searchLab);
module.exports = router;
