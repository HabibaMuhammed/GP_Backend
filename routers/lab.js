const express = require("express");
const router = express.Router();
const labcontroler = require("../controllers/LabController");
const {
 
  getCurrentUser
} = require("../middlewares/UserMW");
//user
router.post(`/evaluate`,getCurrentUser,labcontroler.addSolvedlab);
router.post(`/updatelabstatus`, getCurrentUser, labcontroler.updateSolvedlab); //try to solve
router.get(`/number`, getCurrentUser, labcontroler.numberOfSolvedLabs); //zy recent bs hena btrg3 number of solving bas
router.get("/Fetchlabs", labcontroler.Fetchlabs);
router.post("/Fetchlab", labcontroler.Fetchonelab);

module.exports = router;
