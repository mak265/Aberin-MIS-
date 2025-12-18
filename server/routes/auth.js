const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');
// const nodemailer = require('nodemailer'); // Uncomment if real email is needed

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        user = new User({
            email,
            password: hashedPassword,
            otp,
            otpExpires
        });

        await user.save();
        await ActivityLog.create({ user: user._id, action: 'register', details: user.email });

        // Send OTP (Simulated)
        console.log(`OTP for ${email}: ${otp}`); 
        // In production, use nodemailer to send email here.

        res.status(201).json({ message: 'Registration successful. OTP sent to console (simulated).' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.isVerified) return res.status(200).json({ message: 'User already verified' }); // Allow if already verified to avoid blocking
        
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'Account verified successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Forgot Password Request
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        console.log(`Reset OTP for ${email}: ${otp}`);
        res.json({ message: 'Password reset OTP sent (simulated)' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            ActivityLog.create({ user: user._id, action: 'login', details: user.email });
            res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email role isVerified');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
