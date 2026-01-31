import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
    },
    midName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    fatherName: {
        type: String,
        required: true,
    },
    motherName: {
        type: String,
        required: true
    },
    motherphoneno: {
        type: String,
        required: true
    },
    fatherphoneno: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: { type: String },

    Roll_no: {
        type: String

    },
    dob: {
        type: String
    },
    loginID: {
        type: String,
        required: true,
        lowercase: true,
        unique: true

    },
    password: {
        type: String,
        required: true,
    },
    StudentClass: {
        type: String
    },
    section: {
        type: String
    },
    assignment: [{
        update: {
            type: String,
            default: 'pending'
        },
        homework: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Homework'
        }
    }],
    result: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Result'
    },
    userType: {
        type: String,
        default: 'student'
    },
    active: { type: Boolean }


})

export const Student = mongoose.model("Student", studentSchema)