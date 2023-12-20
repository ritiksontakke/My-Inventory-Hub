const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    // let file = "sample.png";
    // let ext = originalname
    // cb(null, "sample.png");

    let pos = file.originalname.lastIndexOf(".");
    let ext = file.originalname.substring(pos);
    let fileName = Date.now() + ext;

    cb(null, fileName);
  },
});

const uploadFile = multer({ storage: storage });
const noUpload = multer().none(); //add multipart from data

module.exports = {
  uploadFile,
  noUpload,
};
