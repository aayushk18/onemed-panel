import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,

    },
    lastName: {
        type: String,
        required: true,
    },
    dob: {
        type: Date
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true

    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        default: 'student'
    }

})

export const Admin = mongoose.model("Admin", adminSchema)