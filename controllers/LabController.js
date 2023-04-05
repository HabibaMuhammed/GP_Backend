const LabsModel = require("../DB/models/LabsModel");
const SolvedlabsModel = require("../DB/models/Solvedlabs");
let addedlabname;
const addLab= async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ message: "File not provided", error });
    }
    const { name, diffculty, numberofsolving, Flag} = req.body;
    var icon = req.file.path;
  

    const lab = { name, icon, diffculty, numberofsolving, Flag };
    let labs = await LabsModel.findOne({ name: req.body.name });
    if (labs) return res.status(400).json({ message: "Lab already exist" });
    await LabsModel.create(lab);
    return res.status(200).json({ message: "Lab is Added Successfuly" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
const addLabcontent= async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ message: "File not provided", error });
    }
    const {name,header1,header1content,heaader2,header2content,heaader3,header3content,heaader4,header4content} = req.body;
    
    var Containers = req.file.path;

    const lab = {Containers,header1,header1content,heaader2,header2content,heaader3,header3content,heaader4,header4content};
    let labs = await LabsModel.findOne({ name: req.body.name });
    if (!labs) return res.status(400).json({ message: "Lab aren't exist" });
    await LabsModel.updateMany({ name:req.body.name}, lab);
    
    return res.status(200).json({ message: "Lab content is Added Successfuly" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
const numberOfSolvedLabs = async (req, res) => {
  try {
    const Solvedlab = await SolvedlabsModel.find({
      user_id: req.loggedInUser._id,
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
      user_id: req.loggedInUser._id,
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
    const { labid, flag } = req.body;
    const Solvedlab = await SolvedlabsModel.findOne({
      lab_id: labid,
      user_id: req.loggedInUser._id,
    });
    if (Solvedlab) return updateSolvedlab(req, res);
    const lab = await LabsModel.findOne({ _id: labid });

    let status = "Unsolved";
    console.log(lab);
    console.log(flag);

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
      user_id: req.loggedInUser._id,
      Status: status,
    });

    res.status(200).json({ message: status });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { addLab,addLabcontent,addSolvedlab, updateSolvedlab, numberOfSolvedLabs };
