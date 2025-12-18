const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, details) => {
    try {
        const log = new ActivityLog({
            user: userId,
            action,
            details
        });
        await log.save();
    } catch (err) {
        console.error('Logging failed:', err.message);
    }
};

module.exports = logActivity;
