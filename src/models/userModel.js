const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profileImage: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    address: {
        shipping: {
            street: {
                type: String,
                require: true,
                trim: true
            },
            city: {
                type: String,
                require: true,
                trim: true
            },
            pincode: {
                type: Number,
                require: true,
                trim: true
            }
        },

        billing: {
            street: {
                type: String,
                require: true,
                trim: true
            },
            city: {
                type: String,
                require: true,
                trim: true
            },
            pincode: {
                type: Number,
                require: true,
                trim: true
            }
        }
    }
},
    { timestamps: true });

module.exports = mongoose.model('User', userSchema)

