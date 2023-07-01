const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Container");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const fileFilter = (req, file, callback) => {
  var ext = path.extname(file.originalname);
  if (ext !== ".rar" && ext !== ".zip" && ext !== ".pka" && ext !== ".pkz") {
    return callback(new Error("Only images are allowed"));
  }
  callback(null, true);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
