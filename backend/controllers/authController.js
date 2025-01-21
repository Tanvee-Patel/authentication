const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require ('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth');
const {sendOtp, verifyOtp, resetPassword}=require('../controllers/passwordController');


const test = async (req, res) => {
   res.json({ message: 'Hello from the backend!' });
};

const registerUser = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      if (!name) {
         return res.status(400).json({ message: "Name is required" });
      }
      if (!password || password.length < 8) {
         return res.status(400).json({ message: "Password is required and should be at least 8 characters long" });
      }

      const exist = await User.findOne({ email });
      if (exist) {
         return res.status(400).json({ error: "Email already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await User.create({
         name,
         email,
         password: hashedPassword,
      });

      return res.status(201).json({ message: "User created successfully", user });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred while registering the user." });
   }
};

const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }

      const match = await comparePassword(password, user.password);
      if (!match) {
         return res.status(401).json({ error: "Password incorrect" });
      }

      const token = jwt.sign(
         { email: user.email, id: user._id, name: user.name },
         process.env.JWT_SECRET,
         { expiresIn: '1h' }  
      );

      res.cookie('token', token, { 
         httpOnly: true, 
         secure: process.env.NODE_ENV === 'production' });

      res.status(200).json({
         message: "Login successful",
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred while logging in." });
   }
};

const getProfile = async (req, res) => {
   const { token } = req.cookies;
   if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
         if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
         }
         try {
            const user = await User.findOne({ email: decoded.email }).select('-password');  
            if (!user) {
               return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);  
         } catch (error) {
            console.error("Error fetching user profile:", error);
            res.status(500).json({ error: 'Server error' });
         }
      });
   } else {
      res.status(401).json({ error: 'Unauthorized' });
   }
};


const forgotPassword = async (req, res) => {
  const { email, action } = req.body;

  try {
   console.log('Received forgot password request',{email,action});
   
    if (action === 'sendOtp') {
      console.log('Action: sendOtp');
      return sendOtp(req, res);
    }

    if (action === 'resetPassword') {
      const otpVerification = await verifyOtp(req, res);
      if (!otpVerification) {
        return res.status(400).json({ error: 'OTP verification failed' });
      }

      req.body.email = email;
      req.body.newPassword = newPassword;
      return resetPassword(req, res);
    }

    return res.status(400).json({ error: 'Invalid action specified' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during the password reset process.' });
  }
};

module.exports = {
   test,
   registerUser,
   loginUser,
   getProfile,
   forgotPassword
};