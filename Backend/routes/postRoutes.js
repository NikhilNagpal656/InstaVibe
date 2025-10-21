import express from "express"
const postRouter = express.Router()
import { isAuth } from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { commentPost, createPost, followUser, getUserPost, likePost, savePost } from "../controllers/postController.js"

postRouter.post("/uploadpost" , isAuth, upload.single("media") ,createPost)
postRouter.get("/getpost" , isAuth  , getUserPost)
postRouter.post("/likePost/:postId", isAuth , likePost)
postRouter.post("/commentPost/:postId", isAuth , commentPost)
postRouter.get("/saved/:postId", isAuth , savePost)
postRouter.get("/followUser/:followId", isAuth , followUser)


export default postRouter