const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['in', 'out', 'adjustment']
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String // Snapshot of the unit at the time of transaction
    },
    
    // For Stock In
    supplier: {
        type: String
    },

    // For Stock Out
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    requestedBy: {
        type: String
    },
    approvedBy: {
        type: String
    },
    // Payment info for Stock Out
    isPaid: {
        type: Boolean,
        default: false
    },
    orNumber: {
        type: String
    },

    // For Adjustment
    reason: {
        type: String
    },
    previousQuantity: {
        type: Number
    },
    newQuantity: {
        type: Number
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
