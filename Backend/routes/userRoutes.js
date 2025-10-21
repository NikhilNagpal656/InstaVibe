import express from "express"
import { following, getAllNotification, getAllUser, getCurrentUser, getuserProfile, markAsRead, searchUser, updateProfile } from "../controllers/userController.js"
import { isAuth } from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.get("/getuser" , isAuth , getCurrentUser)
userRouter.get("/getfollowing" , isAuth , following)
userRouter.get("/getAllUser" , isAuth , getAllUser)
userRouter.get("/searchuser" , isAuth , searchUser)
userRouter.get("/getNotification" , isAuth , getAllNotification)
userRouter.post("/markasread/" , isAuth , markAsRead)
userRouter.post("/update-profile" , isAuth , upload.single("profilePic") , updateProfile)
userRouter.get("/get-profile/:userName" , isAuth , getuserProfile)

export default userRouter