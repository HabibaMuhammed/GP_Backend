const jwt = require("jsonwebtoken");
const User= require("../DB/models/UserModel");

const authenticate = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) res.status(404).json({ message: "Token not Found" });
      const decodedToken = jwt.verify(authorization, "thisis");
      if (!decodedToken?.id) {
        return res.status(403).json({ message: "Invalid Token or In-valid Payload" });
      } else {
        const user = await User.findOne({ _id: decodedToken.id});
        if (!user) return res.status(404).json({ message: "User Not Found or Email Not Confirmed Check Your Email" });
        req.loggedInUser = user;
        next();
      }
    } catch (error) {
      res.status(500).json({ message: "Catch Error in auth ", error });
    }
  };
};

module.exports=authenticate;
