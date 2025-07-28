const mongoose = require("mongoose");
const {
    genSalt,
    hash,
    compare
} = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password cannot be less than 6 characters"],
        maxlength: [100, "Password cannot be more than 100 characters"],
    },

    firstName: {
        type: String,
        required: false,
        minlength: [2, "First name cannot be less than 2 characters"],
        maxlength: [20, "Firstname cannot be more than 20 characters"],
    },

    lastName: {
        type: String,
        required: false,
        minlength: [2, "Last name cannot be less than 2 characters"],
        maxlength: [20, "Last name cannot be more than 20 characters"],
    },

    image: {
        type: String,
        required: false,
    },

    color: {
        type: Number,
        default: 0,
    },

    profileSetup: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

UserSchema.pre("save", async function (next) {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({
        email: this.email,
        id: this._id,
        profileSetup: this.profileSetup,
        firstName: this.firstName,
        lastName: this.lastName,
        image: this.image,
        color: this.color,
    }, process.env.JWT_KEY, {
        expiresIn: "1d",
    })
}

UserSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await compare(this.password, userPassword);
    return isMatch;
}

const User = mongoose.model("Users", UserSchema);
module.exports = User;