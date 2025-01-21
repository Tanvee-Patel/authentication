const express = require('express');
const { sendOtp, verifyOtp, resetPassword,resetPasswordRequest } = require('../controllers/passwordController');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

router.post('/forgot-password',resetPasswordRequest)
router.post('/forgot-password/reset-password', resetPassword);

module.exports = router;
