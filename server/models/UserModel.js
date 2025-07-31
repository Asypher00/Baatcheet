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
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    // Don't hash if it's already a bcrypt hash
    if (this.password.match(/^\$2[ayb]\$.{56}$/)) return next();
    
    console.log("Hashing password for user:", this.email);
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    console.log("Password hashed successfully");
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
    if (!userPassword || !this.password) {
        console.log("Missing password or hash!");
        return false;
    }
    
    try {
        console.log("About to call bcrypt compare...");
        const isMatch = await compare(userPassword, this.password);
        console.log("Bcrypt compare completed, result:", isMatch);
        return isMatch;
    } catch (error) {
        console.error("Error in comparePassword:", error);
        console.error("Error stack:", error.stack);
        return false;
    }
}

const User = mongoose.model("Users", UserSchema);
module.exports = User;