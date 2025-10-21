import { uploadImage } from "../config/Cloudanary.js"
import { notificationModel } from "../models/notificationModel.js"
import { UserModel } from "../models/userModel.js"

export const getCurrentUser = async (req , res) => {
    try {
        const userId = req.userId
        const user = await UserModel.findById(userId).populate("posts posts.author posts.comments story story.author  following")
        if(!user){
            return res.status(500).json({
            message : "user not found",
        }) 
        }
         return res.status(200).json({
           user
        })  
    } catch (error) {
        return res.status(400).json({
            message : "problem in getting user",
            error : error.message
        })
    }
}

export const getAllUser = async (req ,res) => {
   try {
        const userId = req.userId
    const user = await UserModel.find({_id : {$ne : userId}}).select("-password").sort({
createdAt : -1})

    return res.status(200).json({user})
   } catch (error) {
    return res.status(400).json({error : error.message})
   }
}

export const updateProfile = async (req,res) => {
  try {
      const {name  , userName , bio , gender  , profession} = req.body
    const userId = req.userId
    const imagepath = req?.file?.path

    let user = await UserModel.findById(userId).select("-password")
    if(!user){
        return res.status(500).json({message : 'user not Found'})
    }

    let userWithSameUserName = await UserModel.findOne({userName}).select("-password")

    
    if(userName){
        if(userWithSameUserName && userWithSameUserName.id != userId){
            return res.status(500).json({message : 'This userName is Already taken'})
        }
    }

    let profilePic;
    if(req.file){
        profilePic = await uploadImage(imagepath)
    }

    user.name = name,
    user.userName = userName,
    user.bio = bio , 
    user.profession = profession,
    user.gender = gender
    if(profilePic){
        user.profilePic = profilePic
    }

   await user.save()

    return res.status(200).json({message : "profile edit successfully" , user})

  } catch (error) {
     return res.status(400).json({message : "problem in edit profile" , error : error.message})
  }



}

export const getuserProfile = async (req ,res) => {
try {
     const {userName} = req.params

    if(!userName){
        return res.status(500).json({message : "user not found"})
    }

    const user = await UserModel.findOne({userName}).select("-password").populate("followers following posts savedPosts").populate("posts.author")
     if(!user){
        return res.status(500).json({message : "user not found"})
    }
        return res.status(200).json({message : "user found" , user})
} catch (error) {
     return res.status(400).json({message : "user not found" , error : error.message})
}
}

export const following = async (req ,res) => {
    try {
        const user = await UserModel.findById(req.userId)
        return res.status(200).json(user?.following)
    } catch (error) {
        return res.status(400).json({message : "following error" , error : error.message})
    }
}

export const searchUser = async (req , res) => {
    try{
        const {keyword} = req.query
        if(!keyword){
                return res.status(500).json({message : "keyword not found"})
        }
        const user = await UserModel.find({
            $or : [
                {userName : {$regex : keyword , $options : "i"}},
                {name : {$regex : keyword , $options : "i"}}
            ]
        }).select("-password")

        return res.status(200).json(user)
    }
    catch{
 return res.status(400).json({message : "search error" , error : error.message})
    }
}

export const getAllNotification = async (req, res)=> {
    try {
        const notification = await notificationModel.find({
            reciever : req.userId
        }).populate("sender reciever post reel").sort({createdAt : -1})
        return res.status(200).json(notification)
    } catch (error) {
         return res.status(400).json({message : "notification  error" , error : error.message})
    }
}

export const markAsRead = async (req , res)=> {
    try {
        const {notificationId} = req.body
        if(Array.isArray(notificationId)){
            await notificationModel.updateMany(
                {_id : {$in : notificationId} , reciever : req.userId},
                {$set : {isRead : true}}
            )
        }else{
            await notificationModel.findOneAndUpdate(
                {_id : {$in : notificationId} , reciever : req.userId},
                {$set : {isRead : true}}
            )
        }
        return res.status(200).json({message : "mark as read"})
    } catch (error) {
         return res.status(400).json({message : "mark as read error" , error : error.message})
    }
}