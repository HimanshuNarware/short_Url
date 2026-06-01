const mongoose = require('mongoose');

const clickHistorySchema = mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    userAgent: String,
    deviceType: String,
    country: String,
    referrer: String,
    ip: String
});

const urlSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String
    },
    nnid: {
        type: String,
        required: true,
        unique: true
    },
    maxClicks: {
        type: Number,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    },
    clicks: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // allow legacy URLs without user
    },
    analytics: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analytics'
    },
    clicksHistory: [clickHistorySchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('url', urlSchema);