const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: {
        type: String,
        default: 'Steve'
    },
    level: {
        type: Number,
        default: 42
    },
    avatar: {
        type: String,
        default: '👨‍🌾'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
