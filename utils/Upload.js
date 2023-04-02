const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Container");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

// const fileFilter = (req, file, callback) => {
//   if (
//     path.extname(file.originalname) == "zip" ||
//     path.extname(file.originalname) == "rar"
//   ) {
//     callback(null, true);
//   } else callback("Invalid File Format", false);
// };
const upload = multer({ storage});
module.exports = upload;
