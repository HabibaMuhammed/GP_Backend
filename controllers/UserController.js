const User = require("../DB/models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../DB/models/UserModel");
// CREATE
let register = async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let user = await User.findOne({ email: req.body.email });

    if (user)
      return res.status(409).json({ message: "User already registered" });
    let salt = await bcrypt.genSalt(10);
    let hashedPswd = await bcrypt.hash(req.body.password, salt);

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPswd,
    });
    await user.save();
    return res.status(200).json({ msg: "registred successful" });
  } catch (err) {
    for (let e in err.errors) {
      //error
      res.status(403).json({ message: "bad request" });
    }
  }
};
// RETRIEVE ALL
// let getAll = async (req, res) => {
//   try {
//     let users = await User.find();
//     if (!users) return res.status(400).json({ message: "No users" });
//     res.status(200).json({ message: users });
//   } catch (err) {
//     for (let e in err.errors) {
//       res.status(400).json({ message: "bad req" });
//     }
//   }
// };
//RETRIEVE BY EMAIL

//  UPDATE

const updateUser = async (req, res) => {
  try {
   const {name,email,Location,Birthday} = req.body;
   const {id}=req.user;
   console.log(id);
   let user=await UserModel.updateOne({_id:id},{firstName:name,email,Location,Birthday});
   console.log(user);
    if (user.matchedCount) {
      return res.status(200).json({ message: "User Updated" });
    }
    res.status(404).json({message:"user not found"});
  } catch (error) {
    res.status(400).json(error.message);
  }
};
let login = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ message: "Invalid mail or password" });
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).json({ message: "Invalid mail or password" });

  const token = jwt.sign({ id: user._id }, "thisis");
  res.header("x-auth-token", token);
  return res.status(200).json({ token, name: user.firstName });
};
//DELETE
const deleteUser = async (req, res) => {

  const { id } = req.user.id;
  
  try {
    const user = await User.findOneAndRemove(
      id
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Deleted successfully" });
  } catch (error) {
    res.status(403).json(error.message);
  }
};
module.exports = { register, updateUser, login, deleteUser };
