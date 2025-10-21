import { uploadImage } from "../config/Cloudanary.js";
import { notificationModel } from "../models/notificationModel.js";
import { ReelModel } from "../models/reelModel.js";
import {UserModel} from "../models/userModel.js"
import { getSockedId, io } from "../socket.js";

export const createReel = async (req, res) => {
  try {
    const { caption  } = req.body;
    const userid = req.userId;

    let media;
    if (req.file) {
      media = await uploadImage(req.file.path);
    } else {
      return res.status(500).json({ message: "media is required" });
    }

    let reel = await ReelModel.create({
      caption,
      media,
      author: userid,
    }).then((populatedPost) =>
      populatedPost.populate({
        path: "author",
        select: "name userName profilePic",
      })
    );

    await UserModel.findByIdAndUpdate(userid, { $push: { reels: reel._id } });

    return res.status(200).json({ message: "reel created", reel });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "error in reel creating", error: error.message });
  }
};

export const likeReel = async (req, res) => {
  try {
    const userid = req.userId;
    const { reelId } = req.params;
    let reel = await ReelModel.findById(reelId);
    if (!reel) {
      return res.status(500).json({ message: "reel not found" });
    }

    if (reel.likes.includes(userid)) {
     reel =  await ReelModel.findByIdAndUpdate(reelId, { $pull: { likes: userid } },{new : true});
      await reel.populate("author" , "name userName profilePic")
      io.emit("likeReel" , {
            reelId : reel._id,
            like : reel.likes
          })
      return res.status(200).json(reel)
    } else {
     reel =  await ReelModel.findByIdAndUpdate(reelId, { $push: { likes: userid } },{new : true});
      await reel.populate("author" , "name userName profilePic")
      io.emit("likeReel" , {
            reelId : reel._id,
            like : reel.likes
          })
          if(reel.author._id != req.userId){
                const notification = await notificationModel.create({
                  sender : req.userId,
                  reciever : reel.author._id,
                  type : "like",
                  reel : reel._id,
                  message : "like your reel"
                })
                const populatedNotification = await notificationModel.findById(notification._id).populate("sender reciever reel")
                const recieverSocketid = getSockedId(reel.author._id)
                if(recieverSocketid){
                  io.to(recieverSocketid).emit("newNotification", populatedNotification )
                }
              }
      return res.status(200).json(reel)
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getReel = async (req, res) => {
  try {

    const reel = await ReelModel.find().populate({
      path: "author",
      select: "name userName profilePic",
    }).populate("comments.author");

    if (!reel) {
      return res.status(500).json({ message: "reel not found" });
    }

    return res.status(200).json(reel);
  } catch (error) {
    return res
      .status(400)
      .json({ message: "reel not found", error: error.message });
  }
};

export const commentReel = async (req , res) => {
  try {
    const userid = req.userId
  const {comment} = req.body
  if(!comment){
    return res.status(500).json("comment not given")
  }
  const {reelId} =  req.params

  let reel  = await ReelModel.findById(reelId)

  reel.comments.push({
    author : userid,
    message : comment,
  })
   if(reel.author._id != req.userId){
                const notification = await notificationModel.create({
                  sender : req.userId,
                  reciever : reel.author._id,
                  type : "comment",
                  reel : reel._id,
                  message : "comment on your reel"
                })
                const populatedNotification = await notificationModel.findById(notification._id).populate("sender reciever reel")
                const recieverSocketid = getSockedId(reel.author._id)
                if(recieverSocketid){
                  io.to(recieverSocketid).emit("newNotification", populatedNotification )
                }
              }
  await reel.save()
  await reel.populate("author" , "name userName profilePic")
  await reel.populate("comments.author")
  io.emit("commentReel" , {
            reelId : reel._id,
            comment : reel.comments
          })
  return res.status(200).json(reel)
  } catch (error) {
    return res.status(400).json({error : error.message})
  }

  
}