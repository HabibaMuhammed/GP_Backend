const User = require("../DB/models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../DB/models/UserModel");
const RandomString = require("randomstring");
const SolvedLabs = require("../DB/models/Solvedlabs");
const { myEmail } = require("../Services/SendEmail");
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
      res.status(403).json({ message: "bad request" });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, Location, Birthday } = req.body;
    const { id } = req.user;

    let user = await UserModel.updateOne(
      { _id: id },
      { firstName: name, email, Location, Birthday }
    );

    if (user.matchedCount) {
      return res.status(200).json({ message: "User Updated" });
    }
    res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
let login = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "User not registered" });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).json({ message: "Invalid mail or password" });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.TOKEN_SECRET
  );

  res.header("x-auth-token", token);
  return res.status(200).json({ token, name: user.firstName });
};
const updatePassword = async (req, res) => {
  try {
    const { oldpass, newpass, confirm } = req.body;
    const id = req.user._id;
    let user = await User.findOne({ _id: id });
    const validPass = await bcrypt.compare(oldpass, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Invalid old password" });
    if (newpass != confirm)
      return res.status(400).json({ message: "Don't match" });
    if (newpass.length < 8)
      return res.status(400).json({ message: "too short password" });
    let salt = await bcrypt.genSalt(10);
    let hashedPswd = await bcrypt.hash(newpass, salt);

    user = await UserModel.updateOne({ _id: id }, { password: hashedPswd });

    if (user.matchedCount) {
      return res.status(200).json({ message: "Password updated successfully" });
    }
    res.status(404).json({ message: "User not found" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.user.id;

  try {
    const user = await User.findOneAndRemove(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Deleted successfully" });
  } catch (error) {
    res.status(403).json(error.message);
  }
};
const fetchRecentChallenges = async (req, res) => {
  const id = req.user._id;

  try {
    const recentlabs = await SolvedLabs.find({ user_id: id, Status: "Success" })
      .select({
        time_stamps:0,
        user_id: 0,
        _id: 0,
        Status: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      })
      .populate([{ path: "lab_id", select: { name: 1, icon: 1 } }]);
    res.status(200).json({ recentlabs });
  } catch (error) {
    res.status(403).json(error.message);
  }
};
const sendCode = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email }).select("email");
  if (!user) {
    res.status(404).json({ message: "Not register account" });
  } else {
    const accessCode = RandomString.generate({
      length: 8,
      charset: "numeric",
    });

    await UserModel.findByIdAndUpdate(user._id, { Authcode: accessCode });
    myEmail(user.email, `<h1>"Need a new password? We'll help you get one in just a few minutes."</h1><h2>access code :  ${accessCode} </h2>`);
    res.status(200).json({ message: "Done check ur email" });
  }
};
const validateAuthcode = async (req, res) => {
  const { email, code } = req.body;
  if (!code) {
    res.status(402).json({ message: "RE-enter otp code" });
  } else {
    const user = await UserModel.findOne({ email, Authcode: code });
    if (!user) {
      res
        .status(404)
        .json({ message: "In-valid account or In-valid OTP code" });
    } else {
      res.status(200).json({ message: "Verified" });
    }
  }
};
const Performance = async (req, res) => {
  const id = req.user._id;

  try {
    const labs = await SolvedLabs.find({ user_id: id}).select({
      user_id: 0,
      _id: 0,
      createdAt: 0,
      __v: 0,
    });
    res.status(200).json({ labs });
  } catch (error) {
    res.status(403).json(error.message);
  }
};
const forgetPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "In-valid account" });
  } else {
    let salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await UserModel.updateOne(
      { _id: user._id },
      { Authcode: null, password: hashPassword }
    );
    res.status(200).json({ message: "Password updated" });
  }
};

module.exports = {
  register,
  updateUser,
  login,
  deleteUser,
  fetchRecentChallenges,
  updatePassword,
  sendCode,
  validateAuthcode,
  forgetPassword,
  Performance};
