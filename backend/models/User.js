const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name must be filled"],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email must be filled'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    mobile: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    verifyExpire: {
        type: Date
    },
    resetPasswordToken: {
        type: String,
    },
    resetExpire: {
        type: Date
    }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.genToken = function () {
    return jwt.sign({
        id: this._id,
        email: this.email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}


userSchema.methods.getVerificationToken = function () {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    this.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex')

    this.verifyExpire = Date.now() + 60 * 60 * 1000;

    return verificationToken;
}

userSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.resetExpire = Date.now() + 60 * 60 * 1000;
    return resetToken;

}


const User = mongoose.model('User', userSchema);
module.exports = User