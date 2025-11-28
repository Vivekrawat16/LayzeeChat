const mongoose = require('mongoose');

const NearbyUserSchema = new mongoose.Schema({
    socketId: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    lastActive: {
        type: Date,
        default: Date.now,
        expires: 3600 // Auto-delete after 1 hour of inactivity
    },
    isBusy: {
        type: Boolean,
        default: false
    }
});

// Create 2dsphere index for geospatial queries
NearbyUserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('NearbyUser', NearbyUserSchema);
