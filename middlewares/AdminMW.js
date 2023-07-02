const isAdminMW = (req, res, next) => {
    if (!req.user.isAdmin) return res.status(401).json({ message: "Not Authorized user"});
    next();
  };
  module.exports = isAdminMW;
  