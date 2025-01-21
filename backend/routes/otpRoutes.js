const express = require('express');
const { verifyOtp } = require('../controllers/otpController');

const router = express.Router();

router.post('/verify-otp', verifyOtp);

module.exports = router;
