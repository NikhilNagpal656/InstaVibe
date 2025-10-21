import mongoose from "mongoose"
const messageSchema = new mongoose.Schema({
    sender : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
    reciever : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
    message : {
        type : String
    },
    image : {
        type : String
    }
},{timestamps : true}) 


export const MessageModel = mongoose.model("Message"  , messageSchema)