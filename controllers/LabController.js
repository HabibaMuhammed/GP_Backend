const LabsModel = require("../DB/models/LabsModel");
const SolvedlabsModel=require("../DB/models/Solvedlabs");
const jwt = require("jsonwebtoken");

const numberOfSolvedLabs = async (req, res) => {  //zy recent challenge
  try {
    const Solvedlab = await SolvedlabsModel.find({
      user_id: req.user._id,
    });
    const number = Solvedlab.length;

    res.status(200).json({ numberOfSolvedLabs: number });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const updateSolvedlab = async (req, res) => {
  try {
    const { labid, flag } = req.body;
    const Solvedlab = await SolvedlabsModel.findOne({
      lab_id: labid,
      user_id: req.user._id,
    });
    const lab = await LabsModel.findOne({ _id: labid });
    let status = "Unsolved";

    if (lab.Flag == flag) {
      status = "Success";
      await LabsModel.findByIdAndUpdate(labid, {
        numberofsolving: lab.numberofsolving + 1,
      });
    } else {
      status = "Failed";
    }
    

    await SolvedlabsModel.updateOne({ _id: Solvedlab._id }, { Status: status });
    
    res.status(200).json({ message: status });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
const addSolvedlab = async (req, res) => {
  try {
    const {labid,flag } = req.body;
   



    const Solvedlab = await SolvedlabsModel.findOne({
      lab_id: labid,
      user_id: req.user._id,
    });
    
    if (Solvedlab) return updateSolvedlab(req, res);
    const lab = await LabsModel.findOne({ _id: labid });

    let status = "Unsolved";
    
    

    if (lab.Flag == flag) {
      status = "Success";

      await LabsModel.findByIdAndUpdate(labid, {
        numberofsolving: lab.numberofsolving + 1,
      });
    } else {
      status = "Failed";
    }

    await SolvedlabsModel.create({
      lab_id: labid,
      user_id: req.user._id,
      Status: status,
      
    });

    res.status(200).json({ message: status });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error ??", error });
  }
};
const Fetchlabs = async (req, res) => {
  try {
    let labs = await LabsModel.find().select({ name: 1, _id: 1,icon:1});
    if (!labs) return res.status(400).json({ message: "No Labs" });
    res.status(200).json({labs});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
const Fetchonelab = async (req, res) => {
  try {
    const name = req.body.name;

    let labs = await LabsModel.findOne({ name: name }).select({
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      _id: 1,
      Flag: 0,
      numberofsolving: 0,
    });
    
    if (!labs) return res.status(404).json({ message: "No Lab is founded" });
    return res.status(200).json({ labs});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  Fetchonelab,
  addSolvedlab,
  updateSolvedlab,
  numberOfSolvedLabs,
  Fetchlabs
};
