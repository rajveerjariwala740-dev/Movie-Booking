const express = require('express');
const { register, verifyEmail, forgotPassword, resetPassword, login, getMe } = require('../controllers/userController');
const userRouter = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');

userRouter.post('/register',
    [
        body('name').notEmpty().withMessage('Name required'),
        body('email').isEmail().notEmpty().withMessage('Email required'),
        body('password').isLength({ min: 8, max: 15 }).withMessage('Password Required'),
        body('mobile').isLength({ min: 10 }).withMessage('Mobile Requried'),
    ]
    , register);

userRouter.post('/login', login);
userRouter.post('/me',protect,getMe);
userRouter.get('/verify/:token', verifyEmail);
userRouter.post('/forgotpassword', forgotPassword);
userRouter.put('/resetpassword/:resettoken',resetPassword);

module.exports = userRouter;