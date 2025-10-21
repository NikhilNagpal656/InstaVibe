import express from "express"
const storyRouter = express.Router()
import { isAuth } from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { getAllStory, getStorybyUserName, uploadStory, viewStory } from "../controllers/storyController.js"

storyRouter.post("/uploadStory" , isAuth, upload.single("media") ,uploadStory)
storyRouter.get("/viewers/:storyId" , isAuth  , viewStory)
storyRouter.get("/getuser/:userName", isAuth , getStorybyUserName)
storyRouter.get("/getAllStroy", isAuth , getAllStory)


export default storyRouter