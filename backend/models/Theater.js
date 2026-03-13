const mongoose = require('mongoose')

const theaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name must be filled"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is must"],
        trim: true

    },
    type: {
        type: String,
        enum: ['Open Air', 'Black Box', 'Multiplex'],
        default: 'Multiplex'
    },
    avilableScreens: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Screen'
        }
    ]
}, { timestamps: true });

theaterSchema.index({ name: 1, location: 1 }, { unique: true });
const Theater = mongoose.model('Theater', theaterSchema);
module.exports = Theater;