import { uploadImage } from "../config/Cloudanary.js";
import { conversationModel } from "../models/conversationModel.js";
import { MessageModel } from "../models/messageModel.js";
import { getSockedId, io } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { recieverId } = req.params;
    const { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadImage(req.file.path);
    }

    const newMessage = await MessageModel.create({
      sender: sender,
      reciever: recieverId,
      message,
      image,
    });

    let conversation = await conversationModel.findOne({
      participants: { $all: [sender, recieverId] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [sender, recieverId],
        messages: [newMessage._id],
      });
    }else{
        conversation.messages.push(newMessage._id)
        await conversation.save()
    }
    const recieverSocketId = getSockedId(recieverId)
    if(recieverSocketId){
      io.to(recieverSocketId).emit("newMessage" , newMessage)
    }
    return res.status(200).json(newMessage)
  } catch (error) {
    return res.status(500).json({message : "sending message error" , error : error.message})
  }
};


export const getMessages = async (req , res) => {
    try {
         const sender = req.userId;
    const { recieverId } = req.params;
        const conversation = await conversationModel.findOne({
            participants : {$all : [sender , recieverId]}
        }).populate("messages")
        return res.status(200).json(conversation?.messages)
        
    } catch (error) {
        return res.status(500).json({message : "get message error" , error : error.message})
    }
}

export const getPreviousChats = async (req ,res) => {
    try {
       const currentUserId = req.userId
       let conversations = await conversationModel.find({
        participants : currentUserId
       }).populate("participants").sort({updatedAt : -1})

       let userMap = {}
       conversations.forEach(conv => {
        conv.participants.forEach(user => {
            if(user._id != currentUserId){
                userMap[user._id] = user
            }
        })
       })

       let previoususer = Object.values(userMap)
       return res.status(200).json(previoususer)

    } catch (error) {
          return res.status(500).json({message : "getPreviousChats error" , error : error.message})
    }
}
