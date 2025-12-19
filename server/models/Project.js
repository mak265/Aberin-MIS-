const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    manager: {
        type: String // Name of the Site Engineer / Foreman
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'on-hold'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
