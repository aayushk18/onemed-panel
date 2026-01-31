import bycrypt from "bcryptjs"
import { generateToken } from "../utils/generatetoken.js";
import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";




export const signup = async (req, res) => {
    console.log(req.body);



    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }


    console.log(req.body)

    try {
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const user = await Admin.findOne({ email })

        if (user) return res.status(400).json({ message: "Email already exist" });

        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        const newUser = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            userType: "admin"
        })
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();


            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                userType: newUser.userType

            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ message: "Internal server Error" })

    }
}



export const login = async (req, res) => {


    if (!req.body) {

        return res.status(200).json({ message: "Sorry: Not found" });
    }

    const { email, password } = req.body;

    console.log(email, password);

    try {

        const admin = await Admin.findOne({ email })
        const student = await Student.findOne({ email })


        if (admin) {

            const IsPassCorrectAdmin = await bycrypt.compare(password, admin.password)

            if (admin && IsPassCorrectAdmin) {
                const tok = generateToken(admin._id, res);
                console.log('id : ', admin._id);

                res.status(201).json({
                    _id: admin._id,
                    FirstName: admin.firstName,
                    LastName: admin.lastName,
                    userType: admin.userType
                })
            } else return res.status(400).json({ message: "Invalid a loginID or Password !!" })

        }

        else if (student) {

            const IsPassCorrectStudent = await bycrypt.compare(password, student.password)
            if (student && IsPassCorrectStudent) {


                generateToken(student._id, res)
                res.status(201).json({
                    _id: student._id,
                    FirstName: student.firstName,
                    LastName: student.lastName,
                    userType: student.userType
                })
            } else return res.status(400).json({ message: "Invalid stu loginID or Password !!" })


        } else return res.status(400).json({ message: "Invalid LoginID or Password !!" })
        console.log("Login Successfully");
    } catch (error) {
        console.log("error in Login controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }


}


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)

        console.log("data : ", req.user);


    } catch (error) {
        console.log("error in check Auth controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged Out Successfully!!" })
        console.log("Logged Out Successfully!!")
    } catch (error) {
        console.log("Error in Logout Controller", error.message)
        res.status(500).json({ message: "Internal server error" })

    }
}


