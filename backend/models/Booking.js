const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show'
    },
    seats: {
        type: [Number],
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    seatType: {
        type: String,
        enum: ['standard', 'premium', "vip"],
        default: 'standard'
    },
    status: {
        type: String,
        enum: ['Pending', 'booked', 'cancelled']
    }
}, { timestamps: true })


bookingSchema.index({ user: 1, createdAt: -1 });
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;