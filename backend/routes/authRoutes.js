const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require ('jsonwebtoken')
const {test,registerUser,loginUser,getProfile,forgotPassword} = require('../controllers/authController');
const { sendOtp,resetPassword } = require('../controllers/passwordController');
const { uploadOnCloudinary } = require('../models/cloudinary');
const { upload } = require('../controllers/multer');
const User = require("../models/user");

router.use(
   cors({
      credentials: true,
      origin: 'http://localhost:5173'
   })
)

router.get('/',test)
router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/profile',getProfile)
router.post('/send-otp',sendOtp)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)

router.post("/upload-profile-pic", upload.single("file"), async (req, res) => {
   if (!req.file) {
     return res.status(400).json({ error: "No file uploaded." });
   }

   const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
   if(!token){
    return res.status(401).json({
      error: "No token provided"
    })
   }

   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user=await User.findOne({email: decoded.email});
    if(!user){
      return res.status(404).json({
      error: 'User not found'
      })
    }
    const localFilePath = req.file.path;
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
    if (!cloudinaryResponse) {
      return res.status(500).json({ error: "Failed to upload to Cloudinary." });
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profilePic: cloudinaryResponse.url },
      { new: true }
    );
     if (!updatedUser) {
       return res.status(404).json({ error: "User not found." });
     }
      
     res.status(200).json({
      message: "Profile picture updated.",
      url: cloudinaryResponse.url,
    });

   } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Server error." });
   }
 }); 

 router.post('/logout', (req,res)=>{
  try{
    res.clearCookie('token');
    return res.status(200).json({
      message: 'Logged out Successfully'
    })
  }
  catch(error){
    console.error('Logout error',error);
    return res.status(500).json({
      message: 'Failed to log out'
    })
    
  }
 })

module.exports = router;