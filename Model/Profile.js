const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // legacy support
    },
    name: {
        type: String,
        default: 'Crafter'
    },
    level: {
        type: Number,
        default: 1
    },
    avatar: {
        type: String,
        default: '👨‍🌾'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
