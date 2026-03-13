const Movie = require("../models/Movie");
const Screen = require("../models/Screen");
const Show = require("../models/Show");
const Theater = require("../models/Theater");

const createShow = async (req, res, next) => {
    try {
        const { movie, theater, screen, showDate, showTime, price } = req.body;

        if (!movie || !theater || !screen || !showDate || !showTime || !price) {
            return res.status(400).json({
                success: false,
                message: 'Empty Field Detected'
            })
        }

        //Reference checking
        const movieExists = await Movie.findById(movie);
        if (!movieExists) return res.status(400).json({
            success: false,
            message: 'Movie Not Found'
        })

        const theaterExists = await Theater.findById(theater);
        if (!theaterExists) return res.status(400).json({
            success: false,
            message: 'Theater Not Found'
        })

        const screenExists = await Screen.findById(screen);
        if (!screenExists) return res.status(400).json({
            success: false,
            message: 'Movie Not Found'
        })

        if (screenExists.theater.toString() !== theater.toString()) {
            return res.status(400).json({
                success: false,
                message: "Screen does not belong to theater"
            })
        }

        const show = await Show.create({
            movie,
            theater,
            screen,
            showDate: new Date(showDate),
            showTime: showTime.trim(),
            price: Number(price),
            bookedSeats: [],
        })

        await show.populate('movie theater screen');
        res.status(201).json({
            success: true,
            message: 'Show Created'
        })

    } catch (error) {
        next(error);
    }
}

const getShows = async (req, res, next) => {
    try {
        const query = {};
        const { movie, theater, date, location } = req.query;
        if (movie) query.movie = movie;
        if (theater) query.theater = theater;
        if (date) {
            const start = new Date(date);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);
            query.showDate = { $gte: start, $lte: end };
        }
        let shows = await Show.find(query).populate('movie', 'title poster language genre').populate('theater', 'name location type').populate('screen', 'name type seats').sort({ showDate: 1, showTime: 1 });

        if (location) {
            shows = shows.filter(show => show.theater.location.toLowerCase().includes
                (location.toLowerCase()))
        }

        res.status(200).json({
            success: true,
            count: shows.length,
            shows
        })
    } catch (error) {
        next(error);
    }
}

const getShowById = async (req, res, next) => {
    try {
        const show = await Show.findById(req.params.id).populate('movie', 'title poster language genre').populate('theater', 'name location type').populate('screen', 'name type seats')
        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'Show Not found'
            })
        }

        // Available Seats
        const totalSeats = show.screen.seats;
        const booked = show.bookedSeats.length;
        const available = totalSeats - booked;

        res.status(200).json({
            success: true,
            show,
            availability: { total: totalSeats, booked, available }
        })
    } catch (error) {
        next(error);
    }
}


const updateShow = async (req, res, next) => {
    try {
        const show = await Show.findById(req.params.id);
        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'Show Not Found'
            })
        }

        const { movie, theater, screen, showDate, showTime, price } = req.body;

        if (movie) {
            const movieExists = await Movie.findById(movie);
            if (!movieExists) return res.status(400).json({
                success: false,
                message: 'Movie Not Found'
            })
            show.movie = movie;
        }

        if (theater) {
            const theaterExists = await Theater.findById(theater);
            if (!theaterExists) return res.status(400).json({
                success: false,
                message: 'Theater Not Found'
            })
            show.theater = theater;
        }

        if (screen) {
            const screenExists = await Screen.findById(screen);
            if (!screenExists) return res.status(400).json({
                success: false,
                message: 'Movie Not Found'
            })
            show.screen = screen;
        }

        if(showDate) show.Date = new Date(showDate);
        if(showTime) show.showTime = showTime.trim();
        if(price) show.price = Number(price);

        await show.save();
        await show.populate('movie theater screen');

        res.status(200).json({
            success : true,
            message : 'Show Updated',
            show
        })

    } catch (error) {
        next(error);
    }
}


const deleteShow = async (req, res, next) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.id);
        if (!show) {
            return res.status(400).json({
                success: false,
                message: 'Show Not Found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Show Deleted'
        })


    } catch (error) {
        next(error);
    }
}

module.exports = { createShow, deleteShow,getShows, getShowById,updateShow }