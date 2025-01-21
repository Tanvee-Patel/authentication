const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const User=require('../models/user')

const hashPassword = async (password) => {
  try {
    if (!password) {
      throw new Error('Password is missing');
    }
    
    const salt = await bcrypt.genSalt(12);
    console.log("Generated salt:", salt);    
    const hashedPassword = await bcrypt.hash(password, salt); 
    return hashedPassword;
  } catch (error) {
    console.error('Error in hashPassword:', error);
    throw error;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword); 
  } catch (error) {
    console.error('Error in comparePassword:', error);
    throw error;
  }
};

const generateResetToken = (user) => {
   const jwtSecretKey = process.env.JWT_SECRET;
   const resetToken = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });
   user.resetToken = resetToken;
   user.save();
   return resetToken;
 };

module.exports = { hashPassword, comparePassword, generateResetToken };