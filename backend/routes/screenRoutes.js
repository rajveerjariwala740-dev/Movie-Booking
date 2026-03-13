const express = require('express');
const { getScreens, getScreenById, addScreen, updateScreen, deleteScreen } = require('../controllers/screenController');
const { protect, authorize } = require('../middleware/authMiddleware');
const screenRouter = express.Router();


screenRouter.get('/',getScreens);
screenRouter.get('/:id',getScreenById);

screenRouter.post('/',protect,authorize('admin'), addScreen);
screenRouter.put('/:id',protect,authorize('admin'), updateScreen);
screenRouter.delete('/:id',protect,authorize('admin'), deleteScreen);


module.exports = screenRouter;
