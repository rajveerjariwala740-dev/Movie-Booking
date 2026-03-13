const User = require("../models/User");
const sendEmail = require("../utils/email");
const crypto = require('crypto');
const register = async (req, res, next) => {
    try {
        const { name, email, password, mobile, isAdmin } = req.body;

        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(401).json({
                success: false,
                msg: 'Already an user'
            })
        }

        const user = await User.create({
            name, email, password, mobile, isAdmin
        })


        const verificationToken = user.getVerificationToken();
        await user.save({ validateBeforeSave: false });

        const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/verify/${verificationToken}`;


        const message = `
        <h2>Hello ${name}</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
`;

        console.log("USer email", user.email);
        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify Email',
                html: message,
            })
        } catch (error) {
            console.log(error.message);
            user.verificationToken = undefined;
            user.verifyExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(201).json({
            success: true,
            message: "User Registered"
        })
    } catch (error) {
        next(error);
    }
}

const login = async(req,res,next)=>{
    try {
        const {email,password} = req.body;
         console.log("Is User", req.body);
        const isUser = await User.findOne({email}).select('+password');;
        if(!isUser){
            res.status(401).json({
                success : true,
                message : "Not an user try resgiter"
            })
        }

        let isMatch = await isUser.comparePassword(password);

        // console.log("Is Match", isMatch)
        if(!isMatch){
            return res.status(404).json({
                success : false,
                message : "Invalid Credentails"
            })
        }

        const token = isUser.genToken();
        res.status(200).json({
            success : true,
            message : "Login Successfull",
            token
        })
    } catch (error) {
        next(error)
    }
}

const getMe = (req,res,next)=>{
    try {
        res.status(200).json({
            success : true,
            user : req.user,
        })
    } catch (error) {
        next(error);
    }
}

const verifyEmail = async (req, res, next) => {
    console.log(req.params);
    try {
        const hashedToken = crypto.createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            verificationToken: hashedToken,
            verifyExpire: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token Expired'
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verifyExpire = undefined;

        await user.save();

        const token = user.genToken();

        res.json({
            success: true,
            message: 'Email Verified',
            token,
        })

    } catch (error) {
        next(error);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }

        const resetToken = user.getResetToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/auth/resetpassword/${resetToken}`;

        const message = `This mail is received to rest Password ${resetUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Reset Passwor',
            html: message,
        })

        res.json({
            success: true,
            message : 'Reset Email Sent'
        })
    } catch (error) {
        next(error);
    }
}


const resetPassword = async (req,res,next)=>{
    console.log(req.params);
    try {
        const resetPasswordToken = crypto.createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex')

        const user = await User.findOne(({
            resetPasswordToken,
            resetExpire: {$gt : Date.now()}
        }))

        if(!user){
            return res.status(400).json({
                success : false,
                message : 'Invalid Token',
            })
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetExpire = undefined;
        await user.save();

        const token = user.genToken();
        res.json({
            success : true,
            message : "Password Reset Successfully"
        })

    } catch (error) {
        next(error);
    }
}

module.exports = { register, verifyEmail,forgotPassword,resetPassword,login,getMe};