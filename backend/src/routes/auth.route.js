import express from "express"
import { checkAuth, login, logout, signup } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"


const router = express.Router()

try {


    router.post('/login', login)
    router.get("/check", protectRoute, checkAuth)
    router.post('/logout', logout)
    router.post('/signup', signup)


} catch (error) {
    console.log('Error in auth routing', error.message);

}


export default router;