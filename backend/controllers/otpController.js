const { client } = require('../models/redis');

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpKey = `otp:${email}`;
    const storedOtp = await client.get(otpKey);

    if (!storedOtp) {
      return res.status(400).json({ error: 'OTP has expired or is invalid' });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};

module.exports = { verifyOtp };
