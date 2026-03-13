const upload = require("../middleware/upload");
const Movie = require("../models/Movie");
const cloudinary = require('../utils/cloudinary');

const createMovie = (req, res, next) => {
    upload.single('poster')(req, res, async (err) => {
        if (err) return next(err);
        try {
            const { title, description, rating, language, genre, duration } = req.body;
            if (!title || !description || !duration) return res.status(400).json({
                success: false,
                message: "Missing Fields"
            })
            let poster = '';
            if (req.file) {
                const base64 = req.file.buffer.toString('base64');
                const dataUri = `data:${req.file.mimetype};base64,${base64}`;

                const result = await cloudinary.uploader.upload(dataUri, {
                    folder: 'movie_posters'
                });
                poster = result.secure_url;
            }
            const movie = await Movie.create({
                title, description, rating: Number(rating) || 0, genre, duration: Number(duration), language, poster
            })
            res.status(201).json({
                success: true,
                message: 'Movie Added'
            })

        } catch (error) {
            console.error("CREATE MOVIE ERROR:", error);
            next(error);
        }
    })
}

const getMovies = async (req, res, next) => {
    try {
        const { genre, language, minRating } = req.query;
        const query = {};
        if (genre) query.genre = { $regex: genre, $options: 'i' };
        if (language) query.language = { $regex: language, $options: 'i' };
        if (minRating) query.rating = { $gte: Number(minRating) };

        const movies = await Movie.find(query).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: movies.length,
            movies
        })
    } catch (error) {
        next(error);
    }
}

const updateMovie = async (req, res, next) => {
    upload.single('poster')(req, res, async (err) => {
        if (err) return next(err);
        try {
            const movie = await Movie.findById(req.params.id);

            if (!movie) {
                return res.status(404).json({
                    success: false,
                    message: "Movie Not Found"
                })
            }

            const updatedData = { ...req.body };
            if (req.file) {
                const base64 = req.file.buffer.toString('base64');
                const dataUri = `data:${req.file.mimetype};base64,${base64}`;

                const result = await cloudinary.uploader.upload(dataUri, {
                    folder: 'movie_posters'
                });
                updatedData.poster = result.secure_url;
            }

            const updatedMovie = await Movie.findByIdAndUpdate(
                req.params.id,
                updatedData,
                { new: true, runValidators: true }
            );

            res.json({
                success: true,
                message: 'Movie Updated Successfully',
                movie: updatedMovie,
            })
        } catch (error) {
            next(error);
        }
    })
}

const deleteMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie Not Found"
            })
        }
        res.json({
            success: true,
            message: 'Movie Deleted'
        })
    } catch (error) {
        next(error);
    }
}

const getMovieById = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie Not Found"
            })
        }
        res.json({
            success: true,
            movie
        })
    } catch (error) {
        next(error);
    }
}

module.exports = { createMovie, getMovies, updateMovie, deleteMovie, getMovieById };