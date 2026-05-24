const mongoose = require('mongoose');

const apiKeySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'REVOKED'],
        default: 'ACTIVE'
    },
    lastUsed: {
        type: String,
        default: '--'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
