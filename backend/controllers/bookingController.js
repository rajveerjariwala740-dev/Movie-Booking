const Show = require('../models/Show');
const Screen = require('../models/Screen');
const Booking = require('../models/Booking');
const bookSeat = async (req, res, next) => {
    try {
        const { showId, seats, seatType } = req.body;
        let show;
        //Validation
        if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Fields Missing'
            })
        }

        const showData = await Show.findById(showId).populate('screen');
        if (!showData) {
            return res.status(404).json({
                success: false,
                message: 'Show not found'
            });
        }

        // Now validation works
        if (Math.max(...seats) > showData.screen.seats) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Seat Number'
            });
        }
        show = await Show.findOneAndUpdate({
            _id: showId,
            bookedSeats: { $nin: seats },
        }, {
            $push: { bookedSeats: { $each: seats } }
        }, { new: true })

        if (!show) {
            return res.status(400).json({
                success: false,
                message: 'Seats may be booked or invalid Show'
            })
        }

        const totalAmount = seats.length * show.price;

        const booking = await Booking.create({
            user: req.user._id,
            show: showId,
            seats,
            totalAmount,
            seatType: seatType || 'standard',
            status: 'booked'
        })

        await booking.populate({
            path: 'show',
            populate: [
                { path: 'movie', select: 'title poster' },
                { path: 'theater', select: 'name location' },
                { path: 'screen', select: 'name type seats' }
            ]
        })

        res.status(201).json({
            success: true,
            message: 'Seats Booked',
            booking
        })
    } catch (error) {
        next(error);
    }
}

const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        }).populate({
            path: 'show',
            populate: [
                { path: 'movie', select: 'title poster genre language' },
                { path: 'theater', select: 'name location' },
                { path: 'screen', select: 'name type seats' }
            ]
        }).sort({ bookingDate: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        })
    } catch (error) {
        next(error);
    }
}

const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking Not Found'
            })
        }

        //Checking Ownership
        if (booking.user.toString() != req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized"
            })
        }

        if (booking.status === "cancelled") {
            return res.status(403).json({
                success: false,
                message: 'Already Cancelled'
            })
        }
        let result= await Show.updateOne({
            _id: booking.show
        }, { $pull: { bookedSeats: { $in: booking.seats } } }
    )

    console.log("Result",result);

        booking.status = "cancelled";
        await booking.save();
        return res.status(200).json({
            success: true,
            message: 'Booking Cancelled'
        })
    } catch (error) {
        next(error);
    }
}


const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate({
            path: 'show',
            populate: [
                { path: 'movie', select: 'title poster genre language' },
                { path: 'theater', select: 'name location' },
                { path: 'screen', select: 'name type seats' }
            ]
        }).sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        })
    } catch (error) {
        next(error);
    }
}


module.exports = { bookSeat, getMyBookings, cancelBooking, getAllBookings };