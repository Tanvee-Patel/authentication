const express = require("express");
const multer = require("multer");
const {uploadOnCloudinary} = require ('../models/cloudinary')
const UserModel = require ('../models/user')
const router = express.Router();

const upload = multer({ dest: "uploads/" }); 

router.post("/upload-profile-pic", upload.single("file"), async (req, res) => {
  const userId = req.user.id; 

  try {
    const uploadResponse = await uploadOnCloudinary(req.file.path);

    if (!uploadResponse) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profilePic: {
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
        },
      },
      { new: true } 
    );

    res.status(200).json({ message: "Profile picture updated", url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
