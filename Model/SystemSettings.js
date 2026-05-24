const mongoose = require('mongoose');

const systemSettingsSchema = mongoose.Schema({
    rateLimit: {
        type: Number,
        default: 1000
    },
    burstAllowance: {
        type: Number,
        default: 50
    },
    smartThrottling: {
        type: Boolean,
        default: true
    },
    dnsChecks: {
        type: Boolean,
        default: true
    },
    malwareFiltering: {
        type: Boolean,
        default: true
    },
    deepAnalysis: {
        type: Boolean,
        default: false
    },
    resolutionReplicas: {
        type: Number,
        default: 8
    },
    analyticsReplicas: {
        type: Number,
        default: 2
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
