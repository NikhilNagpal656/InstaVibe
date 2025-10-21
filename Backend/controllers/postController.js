import { uploadImage } from "../config/Cloudanary.js";
import { notificationModel } from "../models/notificationModel.js";
import { PostModel } from "../models/postModel.js";
import { UserModel } from "../models/userModel.js";
import { getSockedId, io } from "../socket.js";


export const createPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;
    const userid = req.userId;

    let media;
    if (req.file) {
      media = await uploadImage(req.file.path);
    } else {
      return res.status(500).json({ message: "media is required" });
    }

    const post = await PostModel.create({
      caption,
      media,
      mediaType,
      author: userid,
    }).then((populatedPost) =>
      populatedPost.populate({
        path: "author",
        select: "name userName profilePic",
      })
    );

    await UserModel.findByIdAndUpdate(userid, { $push: { posts: post._id } });

    return res.status(200).json(post);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error in post creating", error: error.message });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const post = await PostModel.find().sort({createdAt : -1}).populate({
      path: "author",
      select: "name userName profilePic",
    }).populate("comments.author")

    if (!post) {
      return res.status(500).json({ message: "post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "post not found", error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const userid = req.userId;
    const { postId } = req.params;
    let post = await PostModel.findById(postId);
    if (!post) {
      return res.status(500).json({ message: "post not found" });
    }

    if (post.likes.includes(userid)) {
     post =  await PostModel.findByIdAndUpdate(postId, { $pull: { likes: userid } } , {new : true});
     await post.populate("author" , "name userName profilePic")
     io.emit("likePost" , {
      postId : post._id,
      like : post.likes
    })
      return res.status(200).json(post)
    } else {
     post =  await PostModel.findByIdAndUpdate(postId, { $push: { likes: userid } } ,{new : true});
     await post.populate("author" , "name userName profilePic")
     io.emit("likePost" , {
      postId : post._id,
      like : post.likes
    })
      if(post.author._id != req.userId){
      const notification = await notificationModel.create({
        sender : req.userId,
        reciever : post.author._id,
        type : "like",
        post : post._id,
        message : "liked your post"
      })
      const populatedNotification = await notificationModel.findById(notification._id).populate("sender reciever post").sort({createdAt : -1})
      const recieverSocketid = getSockedId(post.author._id)
      if(recieverSocketid){
        io.to(recieverSocketid).emit("newNotification", populatedNotification )
      }
    }
      return res.status(200).json(post)
    }

    

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const commentPost = async (req , res) => {
  try {
    const userid = req.userId
  const {comment} = req.body
  if(!comment){
    return res.status(500).json("comment not given")
  }
  const {postId} =  req.params

  let post  = await PostModel.findById(postId)

  post.comments.push({
    author : userid,
    message : comment,
  })
  if(post.author._id != req.userId){
      const notification = await notificationModel.create({
        sender : req.userId,
        reciever : post.author._id,
        type : "comment",
        post : post._id,
        message : "commented on  your post"
      })
      const populatedNotification = await notificationModel.findById(notification._id).populate("sender reciever post").sort({createdAt : -1})
      const recieverSocketid = getSockedId(post.author._id)
      if(recieverSocketid){
        io.to(recieverSocketid).emit("newNotification", populatedNotification )
      }
    }
  await post.save()
  await post.populate("author" , "name userName profilePic")
  await post.populate("comments.author")
  io.emit("commentPost" , {
      postId : post._id,
      comment : post.comments
    })
  return res.status(200).json(post)
  } catch (error) {
    return res.status(400).json({error : error.message})
  }

  
}

export const savePost = async(req , res) =>{
  try {
    const userid = req.userId
  const {postId} = req.params
  let user = await UserModel.findById(userid)

  if(user.savedPosts.includes(postId)){
    user =   await UserModel.findByIdAndUpdate(userid , {$pull : {savedPosts : postId}} , {new : true})
      return res.status(200).json(user)
  }else{
     user =   await UserModel.findByIdAndUpdate(userid , {$push : {savedPosts : postId}},{new : true})
      return res.status(200).json(user)
  }
  } catch (error) {
     return res.status(400).json({error : error.message})
  }
}

export const followUser = async (req , res) => {
  const userid = req.userId
  const {followId} = req.params

  const followUser = await UserModel.findById(followId) 

  if(followUser.followers.includes(userid)){
      await UserModel.findByIdAndUpdate(followId ,{$pull : {followers : userid}})
      await UserModel.findByIdAndUpdate(userid ,{$pull : {following : followId}})
  }else{
    await UserModel.findByIdAndUpdate(followId ,{$push : {followers : userid}})
      await UserModel.findByIdAndUpdate(userid ,{$push : {following : followId}})
       if(userid != followUser._id){
                      const notification = await notificationModel.create({
                        sender : userid,
                        reciever : followUser._id,
                        type : "follow",
                        message : "started following you"
                      })
                      const populatedNotification = await notificationModel.findById(notification._id).populate("sender reciever")
                      const recieverSocketid = getSockedId(followUser._id)
                      if(recieverSocketid){
                        io.to(recieverSocketid).emit("newNotification", populatedNotification )
                      }
                    }
  }

  return res.status(200).json("user follow ")

}

