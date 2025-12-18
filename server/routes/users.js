const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const logActivity = require('../utils/logger');
const bcrypt = require('bcryptjs');

// Get all users (Admin only)
router.get('/', auth, roles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password -otp -otpExpires').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create user (Admin only)
router.post('/', auth, roles('admin'), async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (role && !['admin', 'warehouse_staff', 'site_engineer', 'client'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      email,
      password: hashedPassword,
      role: role || 'warehouse_staff',
      isVerified: true
    });
    await user.save();
    await logActivity(req.user.id, 'create_user', `Created user ${user.email} (${user.role})`);
    res.status(201).json({ _id: user._id, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user role (Admin only)
router.put('/:id/role', auth, roles('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'warehouse_staff', 'site_engineer', 'client'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent changing own role to lose admin access (optional safety check)
    if (req.user.id === user.id && role !== 'admin') {
      return res.status(400).json({ message: 'Cannot remove your own admin privileges' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await logActivity(req.user.id, 'update_user_role', `Changed role for ${user.email} from ${oldRole} to ${role}`);
    
    res.json({ message: 'User role updated', user: { _id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', auth, roles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.user.id === user.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    await user.deleteOne();
    await logActivity(req.user.id, 'delete_user', `Deleted user ${user.email}`);

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
