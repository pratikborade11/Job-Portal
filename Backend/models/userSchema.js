import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name!"],
        minLength: [3, "Name must contain at least 3 characters"],
        maxLength: [30, "Name cannot exceed 30 characters"],

    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        validate: [validator.isEmail, "Please provide valid email address!"],

    },
    phone: {
        type: Number,
        required: [true, "Please provide your Phone number!"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"],
        minLength: [8, "Password must contain atleast 8 characters"],
        maxLength: [15, "Password cannot exceed 15 characters"],
        select : false,
    },
    role: {
        type: String,
        required: [true, "Please provide your role"],
        enum: ["Job Seeker", "Employer"],
    },
    createdAt: {
        type: Date,
        default: Date.now,

    },
});


//Passwor Encryption (Hashing) check befor saving data of userschema
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//Compairing Password
userSchema.methods.ComparePassword = async function (enterdPassword) {
    return await bcrypt.compare(enterdPassword, this.password);
};

//Generating Json Web Token for authorization
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User",userSchema);
