const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String, // e.g., 'created_item', 'stock_in', 'login'
        required: true
    },
    details: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
