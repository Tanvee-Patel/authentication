const {client}=require ('../models/redis')
const {sendMail}=require('../config/mailer')
const {hashPassword}=require('../helpers/auth');
const User=require('../models/user')
const crypto = require('crypto');
const bcrypt=require('bcrypt');
const {generateResetToken}=require('../helpers/auth')

const sendOtp=async(req,res)=>{
  const {email}=req.body;
  try{
    const user=await User.findOne({email});
    if(!user){
      return res.status(404).json({
        error: 'User not found'
      })
    }
    const otp =Math.floor(10000+Math.random()*900000)
    const otpKey=`otp:${email}`;
    const expirationTime=600;
    await client.setEx(otpKey,expirationTime,otp.toString());

    try{
    await sendMail(email,'Password Reset OTP',`Your OTP is: ${otp}`);
  }
  catch (mailError) {
    console.error('Email sending failed', mailError);
    return res.status(500).json({ error: 'Failed to send OTP email.' });
  }
    res.json({
      message: 'OTP sent to your email'
    })
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      error: 'Failed to send OTP. Please try again'
    })
    
  }
}

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format.' });
  }
  if (!otp || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ success: false, error: 'OTP must be a valid 6-digit number.' });
  }

  try {
    if (!client.isReady) {
      return res.status(500).json({ success: false, error: 'OTP service is temporarily unavailable.' });
    }

    const otpKey = `otp:${email}`;
    const storedOtp = await client.get(otpKey);

    if (!storedOtp) {
      return res.status(400).json({ success: false, error: 'Invalid OTP or expired.' });
    }

    if (!crypto.timingSafeEqual(Buffer.from(storedOtp), Buffer.from(otp))) {
      return res.status(400).json({ success: false, error: 'Invalid OTP or expired.' });
    }
    await client.del(otpKey);

    res.json({
      success: true,
      message: 'OTP verified successfully.',
      data: { email },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred. Please try again.',
    });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  console.log('Reset password endpoint hit::',req.body);
  console.log('Reset token: ',resetToken);
  
  
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  if (!newPassword) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const user = await User.findOne({ email: resetToken });
    if (!user) {
      return res.status(404).json({ error: 'User Not found' });
    }

    user.password = await hashPassword(newPassword);
    user.resetToken=undefined;
    await user.save();

    // const otpKey = `otp:${user.email}`;
    // await client.del(otpKey);

    res.json({ message: 'Password reset successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
};

const resetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = generateResetToken(user);
    console.log("Reset Token: ",resetToken);
    

    res.status(200).json({ message: 'Password reset token sent to email' });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};


module.exports = { sendOtp, verifyOtp, resetPassword, resetPasswordRequest };
