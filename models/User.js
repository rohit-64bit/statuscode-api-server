const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const Otp = require('./Otp');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    details: {
        height: {
            type: Number,
        },
        weight: {
            type: Number,
        }
    },
    dob: {
        type: Date,
        required: true
    },
    isAuth: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
})

UserSchema.methods.generateOTP = async function () {

    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });

    const data = new Otp({
        otp,
        email: this.email,
        userID: this._id
    })

    await data.save();

    return otp;

}

UserSchema.methods.updatePassword = async function (password) {

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);

    await this.save();

    return;
};

UserSchema.methods.verifyOTP = async function (otp, userID) {

    const data = await Otp.findOne({ otp, userID: userID, isVerified: false });

    if (!data) {
        throw new Error('Invalid OTP');
    }

    data.isVerified = true;

    await data.save();

    return;

}

UserSchema.methods.generateAuthToken = function () {

    const token = jwt.sign({ id: this.id, type: "user" }, process.env.JWT_SECRET);
    return token;
}

module.exports = mongoose.model('User', UserSchema);