import express from "express"
import { changePassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/signUp" ,signUp)
authRouter.post("/signIn"  ,signIn)
authRouter.get("/signOut" ,signOut)
authRouter.post("/sendotp" ,sendOtp)
authRouter.post("/verifyotp" ,verifyOtp)
authRouter.post("/changePassword" ,changePassword)

export default authRouter