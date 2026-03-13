const express = require('express');
const showRouter = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createShow, deleteShow, getShows, getShowById, updateShow } = require('../controllers/showController');

showRouter.get('/', getShows);
showRouter.get('/:id', getShowById);
showRouter.post('/', protect, authorize('admin'), createShow);
showRouter.delete('/:id', protect, authorize('admin'), deleteShow);
showRouter.put('/:id', protect, authorize('admin'), updateShow);

module.exports = showRouter;