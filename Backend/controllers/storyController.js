import { uploadImage } from "../config/Cloudanary.js"
import { StoryModel } from "../models/storyModel.js"
import { UserModel } from "../models/userModel.js"

export const uploadStory = async (req , res) => {
      try {
          const userid = req.userId
        const {mediaType} = req.body
        const user = await UserModel.findById(userid)

        if(user.story){
            await StoryModel.findByIdAndDelete(user.story)
            user.story = null
        }

        let media 
        if(req.file){
            media = await uploadImage(req.file.path)
        }else{
            return res.status(500).json({message : "media is required"})
        }

     const story =  await StoryModel.create({mediaType , media , author : userid})

     user.story = story._id
     await user.save()
     const populatedStory = await StoryModel.findById(story._id).populate("author" , "name userName profilePic").populate("viewers" , "name userName profilePic")

     return res.status(200).json({story : populatedStory})
      } catch (error) {
        
     return res.status(400).json({error : error.message})
      }
}

export const viewStory = async (req , res) => {
    try {
        const {storyId} = req.params
        const story = await StoryModel.findById(storyId)
        if(!story){
            return res.status(500).json({message : "story not found"})
        }

        const viewerId = story.viewers.map((id)=> id.toString())
        if(!viewerId.includes(req.userId.toString())){
                story.viewers.push(req.userId)
                await story.save()
        }

        const populatedStory = await StoryModel.findById(story._id).populate("author" , "name userName profilePic").populate("viewers" , "name userName profilePic")
        
     return res.status(200).json({populatedStory})
    } catch (error) {
        return res.status(400).json({message :"viewStroy error" ,error : error.message})
    }
}

export const getStorybyUserName = async (req,res) => {
    try {
        const {userName} = req.params
        const user = await UserModel.findOne({userName})
        if(!user){
            return res.status(500).json({message : "user not found"})
        }
        const story = await StoryModel.find({author : user._id}).populate("viewers author")
           return res.status(200).json(story)
    } catch (error) {
             return res.status(400).json({message :"getStory error" ,error : error.message})
    }
}

export const getAllStory =async (req , res) => {
    try {
        const user = await UserModel.findById(req.userId)
        const followingId = user.following

        const stories = await StoryModel.find({author : {$in : followingId}}).populate("viewers author").sort({createdAt : -1})

        return res.status(200).json(stories)

    } catch (error) {
       return res.status(400).json({message :"getStory error" ,error : error.message})
    }
}