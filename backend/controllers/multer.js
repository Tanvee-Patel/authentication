const multer = require("multer")
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
   destination: function(req, file, cb){
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
         fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
   },
   filename: function(req, file, cb){
      cb(null, file.originalname);
   }
});

const fileFilter = (req, file, cb) => {
   const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
   if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
   } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, JPG, and PDF are allowed."));
   }
};

module.exports = {
   upload: multer({
   storage,
   fileFilter
   })
}