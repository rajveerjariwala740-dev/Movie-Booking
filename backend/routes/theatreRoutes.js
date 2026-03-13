const express = require('express');
const { getTheatres, createTheater, updateTheatre, deleteTheatre } = require('../controllers/theaterController');
const theatreRouter = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

theatreRouter.get('/',getTheatres);
theatreRouter.post('/', protect,authorize('admin'), createTheater);
theatreRouter.put('/:id', protect,authorize('admin'),updateTheatre);
theatreRouter.delete('/:id', protect,authorize('admin'),deleteTheatre);


module.exports = theatreRouter;