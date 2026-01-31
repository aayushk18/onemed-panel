import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;


        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token Provided" })
        }
        console.log("token", req.cookies.jwt);



        const decoded = jwt.verify(token, process.env.JWT_SECRET)



        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" })
        }

        const adminUser = await Admin.findById(decoded.userId).select("-password")
        const studentUser = await Student.findById(decoded.userId).select("-password")

        if (adminUser) { req.user = adminUser }
        else if (studentUser) { req.user = studentUser }
        else return res.status(401).json({ message: "User not found" })

        next();

    } catch (error) {
        console.log("Error in protect router middleware", error.message)
        res.status(500).json({ message: "Internal server error" })

    }
} 