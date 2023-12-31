const LabsModel = require("../DB/models/LabsModel");

const addLab = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ message: "File not provided", error });
    }
    const { name,Flag } = req.body;
    var icon = req.file.path;

    const lab = { name, icon, Flag };
    let labs = await LabsModel.findOne({ name: req.body.name });
    if (labs) return res.status(409).json({ message: "Lab already exist" });
    await LabsModel.create(lab);
    return res.status(200).json({ message: "Lab is Added Successfuly" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const addLabcontent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ message: "File not provided", error });
    }
    const { name, headers, headers_content } = req.body;

    var Containers = req.file.path;

    const newheaders = headers.split(",");
    const newheaders_content = headers_content.split(",");

    let labs = await LabsModel.findOne({ name: name });
    if (!labs) return res.status(404).json({ message: "Lab aren't exist" });
    await LabsModel.updateOne(
      { name: req.body.name },
      { headers: newheaders, headers_content: newheaders_content, Containers }
    );

    return res
      .status(200)
      .json({ message: "Lab content is Added Successfuly" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
const getlabs = async (req, res) => {
  try {
    let labs = await LabsModel.find().select({
      name: 1,
      _id: 0,
      icon: 1,
      numberofsolving: 1,
      Diffculty: 1,
    });
    if (!labs) return res.status(400).json({ message: "No Labs" });
    res.status(200).json({ message: labs });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
const deletelab = async (req, res) => {
  const name = req.body.name;
  const lab = LabsModel.findOne({ name: name });
  console.log(lab);
  try {
    const labs = await LabsModel.findOneAndRemove(lab);

    if (!labs) {
      return res.status(404).json({ message: "lab not found" });
    }
    res.status(200).json({ message: "Lab Deleted successfully" });
  } catch (error) {
    res.status(403).json(error.message);
  }
};
module.exports = {
  addLab,
  addLabcontent,
  getlabs,
  deletelab,
};
