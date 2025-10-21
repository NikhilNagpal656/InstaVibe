import express from "express"
const reelRouter = express.Router()
import { isAuth } from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { commentReel, createReel, getReel, likeReel } from "../controllers/reelController.js"

reelRouter.post("/uploadreel" , isAuth, upload.single("media") ,createReel)
reelRouter.get("/getreel" , isAuth  , getReel)
reelRouter.post("/likeReel/:reelId", isAuth , likeReel)
reelRouter.post("/commentReel/:reelId", isAuth , commentReel)


export default reelRouter