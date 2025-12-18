const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemCode: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined to not clash, but uniqueness enforced if present
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    minStock: {
        type: Number,
        default: 10
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    unit: {
        type: String,
        required: true,
        default: 'piece', 
        enum: ['piece', 'kg', 'g', 'lb', 'oz', 'l', 'ml', 'box', 'pack']
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Item', ItemSchema);
