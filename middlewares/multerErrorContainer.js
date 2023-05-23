const handleMulterError = (err, req, res, next) => {
  if (err) return res.status(400).json({ message: "File Format Error",type:2});
  next();
};
module.exports = handleMulterError;
