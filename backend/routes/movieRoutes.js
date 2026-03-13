const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { createMovie, getMovies, updateMovie, deleteMovie, getMovieById } = require('../controllers/movieController');
// const { getRounds } = require('bcrypt');
const movieRouter = express.Router();

movieRouter.get('/', getMovies);
movieRouter.get('/:id', getMovieById);
movieRouter.post('/', protect,authorize('admin'), createMovie);
movieRouter.put('/:id', protect,authorize('admin'),updateMovie);
movieRouter.delete('/:id',protect,authorize('admin'),deleteMovie);

module.exports = movieRouter;
