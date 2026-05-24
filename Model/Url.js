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
    clicks: {
        type: Number,
        default: 0
    },
    clicksHistory: [clickHistorySchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('url', urlSchema);