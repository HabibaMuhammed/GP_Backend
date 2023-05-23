const jwt = require('jsonwebtoken');
const validator = require("../utils/UsersValidator");
const User = require("../DB/models/UserModel");

const validatorMiddleware = (req, res, nxt) => {
  let valid = validator(req.body);
  if (valid) {
    req.valid = 1;
    nxt();
  } else {
    res.status(403).json({message : "forbidden command"});
  }
};

async function getCurrentUser(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) res.status(404).json({ message: "Token not Found" });
    const decodedToken = jwt.verify(authorization, "grad2023");
    if (!decodedToken?.id) {
      return res.status(403).json({ message: "Invalid Token or In-valid Payload" });
    } else {
      const user = await User.findOne({ _id: decodedToken.id});
      if (!user) return res.status(404).json({ message: "User Not Found or Email Not Confirmed Check Your Email" });
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "Catch Error in auth ", error });
  }
}

module.exports = {
  validatorMiddleware,
  getCurrentUser
};
