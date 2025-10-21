import mongoose from "mongoose"
const notificationSchema = new mongoose.Schema({
    sender : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required : true
              },
        reciever : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required : true
              },
        isRead : {
            type : Boolean,
            default : false
        },
        reel : {
             type: mongoose.Schema.Types.ObjectId,
                ref: "Reel",
        },
        message : {
            type : String
        },
        post : {
             type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
        },
        type : {
            type : String,
            enum : ["like" , "comment" , "follow"],
            required : true
        }
},{timestamps : true})

export const notificationModel = mongoose.model("Notification" , notificationSchema)
