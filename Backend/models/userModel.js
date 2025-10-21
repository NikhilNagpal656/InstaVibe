import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    bio: {
      type: String,
    },
    profession: {
      type: String,
    },
    gender: {
      type: String,
      enum : ["male" , "female"]
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    reels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel",
      },
    ],
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
    },
    resetOtp : {
      type : String
    },
    otpExpire : {
      type : Date
    },
    isOtpMatch : {
      type : Boolean,
      default : false
    }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
