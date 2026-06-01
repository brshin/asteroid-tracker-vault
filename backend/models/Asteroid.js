const mongoose = require('mongoose');

const asteroidSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    potentiallyHazardous: {
        type: Boolean,
        required: true
    },
    note: {
        type: String,
        default: ""
    },
    userId: { type: String, required: true}
});

module.exports = mongoose.model('Asteroid', asteroidSchema);