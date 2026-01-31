import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import studentRouter from "./routes/student.route.js";
import teacherRouter from "./routes/teacher.route.js";
import { connectDB } from "./utils/db.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }))

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));




app.use("/api/testing", (req, res) => {
    console.log("Testing", req.body);

    res.send("Hello World")
})
app.use("/api/user/auth/", authRouter);
app.use("/api/user/admin/", adminRouter);
app.use("/api/user/student/", studentRouter);
app.use("/api/user/teacher/", teacherRouter);


if (process.env.NODE_ENV == "production") {

    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // CHANGE THIS LINE:
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
});