const User = require("../DB/models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../DB/models/UserModel");
const RandomString = require("randomstring");
const SolvedLabs = require("../DB/models/Solvedlabs");
const { myEmail } = require("../Services/SendEmail");
const escapeHtml = require('escape-html');

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
    let safeemail = escapeHtml(req.body.email);

    let user = await User.findOne({ email: req.body.email });

    if (user)
      return res.status(409).json({ message: "User already registered" });
    let salt = await bcrypt.genSalt(10);
    let hashedPswd = await bcrypt.hash(req.body.password, salt);
    let safefirstname = escapeHtml(req.body.firstName);
    let safelastname = escapeHtml(req.body.lastname);
    user = new User({
      firstName: safefirstname,
      lastName: safelastname,
      email: safeemail,
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
    let safename = escapeHtml(name);
    let safeemail = escapeHtml(email);
    let safeloc = escapeHtml(Location);
    let safeBirthday = escapeHtml(Birthday);
    let user = await UserModel.updateOne(
      { _id: id },
      { firstName: safename, email:safeemail, Location:safeloc, Birthday:safeBirthday }
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
  let safeemail = escapeHtml(req.body.email);
  let user = await User.findOne({ email: safeemail});
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
  const id = req.user.id;
  try {
    const user = await User.findByIdAndDelete(id);
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
        time_stamps: 0,
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
  let safeemail = escapeHtml(email);
  const user = await UserModel.findOne({ safeemail }).select("email");
  if (!user) {
    res.status(404).json({ message: "Not register account" });
  } else {
    const accessCode = RandomString.generate({
      length: 8,
      charset: "numeric",
    });

    await UserModel.findByIdAndUpdate(user._id, { Authcode: accessCode });
    myEmail(
      user.email,
      `<h1>"Need a new password? We'll help you get one in just a few minutes."</h1><h2>access code :  ${accessCode} </h2>`
    );
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
    const labs = await SolvedLabs.find({ user_id: id }).select({
      user_id: 0,
      _id: 0,
      lab_id: 0,
      createdAt: 0,
      __v: 0,
    });
    const map = new Map();
    for (let index = 0; index < labs.length; index++) {
      let element = labs[index];
      let date = element.updatedAt;
      date = date.toString().split(" ");
      const [weekDay, month, day] = date;
      date = weekDay + "-" + month + "-" + day;
      if (map.has(date)) {
        let value = map.get(date);
        if ((element.Status == "Success")) map.set(date, value + 1);
      } else {
        if ((element.Status == "Success")) map.set(date, 1);
        else map.set(date, 0);
      }
    }
    let maps=Object.fromEntries(map);
    res.status(200).json(maps);
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
  Performance,
};
