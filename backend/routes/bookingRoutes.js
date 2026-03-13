const express = require('express')
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { bookSeat, getMyBookings, cancelBooking, getAllBookings } = require('../controllers/bookingController');

router.post('/', protect, bookSeat);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);


//Admin Only
router.get('/all-bookings', protect, authorize('admin'), getAllBookings);


module.exports = { router };