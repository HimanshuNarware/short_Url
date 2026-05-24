const mongoose = require('mongoose');

const analyticsSchema = mongoose.Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'url',
        required: true
    },
    nnid: {
        type: String,
        required: true
    },
    userAgent: String,
    deviceType: String,
    country: String,
    referrer: String,
    ip: String,
    timestamp: {
        type: Date,
        default: Date.now
    },
    os:String,
    browser:String,
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);
