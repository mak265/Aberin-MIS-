const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// GET all activity logs (Admin only)
router.get('/', auth, roles('admin'), async (req, res) => {
    try {
        const { startDate, endDate, action } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.timestamp.$lte = end;
            }
        }

        if (action) {
            query.action = action;
        }

        const logs = await ActivityLog.find(query)
            .populate('user', 'email role')
            .sort({ timestamp: -1 })
            .limit(1000); // Limit to last 1000 logs for performance

        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;