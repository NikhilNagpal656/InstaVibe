import express from "express"
const messageRouter = express.Router()
import { isAuth } from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { getMessages, getPreviousChats, sendMessage } from "../controllers/messageController.js"

messageRouter.post("/sendMessage/:recieverId" , isAuth, upload.single("media") ,sendMessage)
messageRouter.get("/getMessage/:recieverId" , isAuth  , getMessages)
messageRouter.get("/prevChats", isAuth , getPreviousChats)


export default messageRouter