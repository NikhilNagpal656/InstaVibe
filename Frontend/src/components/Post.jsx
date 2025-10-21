import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa";
import { BiCommentDetail, BiCrosshair } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { FaRegBookmark } from "react-icons/fa6";
import { FcLike } from "react-icons/fc";
import { IoMdSend } from "react-icons/io";
import { IoMdBookmark } from "react-icons/io";
import axios from "axios";
import { setPostData } from "../utils/postSlice";
import { setUserData } from "../utils/userSlice";
import Button from "./Button";
import { serverUrl } from "../App";
const Post = ({ post }) => {
  const  {user}  = useSelector((state) => state.userSlice);
  
  const { postData } = useSelector((state) => state.postSlice);
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [isCommentOpen, setIsCommentOpen] = useState(false);
    const { socketData } = useSelector((state) => state.socketSlice);

  const handleLike = async (id) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/likePost/${id}`,
        {},
        { withCredentials: true }
      );
      const posts = res.data;
      const likePost = postData.map((p) => (p._id == id ? posts : p));
      dispatch(setPostData(likePost));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    socketData?.on("likePost",(updated)=>{
      const likePost = postData.map((p) => (p._id == updated.postId ? {...p ,likes : updated.like} : p))
      dispatch(setPostData(likePost))
  })
    socketData?.on("commentPost",(updated)=>{
      const commnetPost = postData.map((p) => (p._id == updated.postId ? {...p ,comments : updated.comment} : p))
      dispatch(setPostData(commnetPost))
  })
  return ()=> {
    socketData?.off("likePost")
    socketData?.off("commentPost")
  }
  },[dispatch ,postData , socketData])

  const handleComment = async (id) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/commentPost/${id}`,
        { comment },
        { withCredentials: true }
      );
      const posts = res.data;
      const commnetPost = postData.map((p) => (p._id == id ? posts : p));
      dispatch(setPostData(commnetPost));
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };
  const handleSavedPost = async (id) => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/post/saved/${id}`,
        { withCredentials: true }
      );
      dispatch(setUserData(res.data))
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className="flex flex-col gap-5 relative w-[95%] mx-auto h-[600px] shadow-sm shadow-black/60 text-black mt-10 rounded-2xl px-4 py-4">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-2 items-start">
          <div className="w-15 h-15 rounded-full">
            <img
              className="w-full h-full rounded-full object-center"
              src={post.author.profilePic}
              alt=""
            />
          </div>
          <p>{post.author.userName}</p>
        </div>
        {post.author._id != user._id && (
            <Button tailWind={"font-medium cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-2xl"} id ={post.author._id}/>
        )}
      </div>

      <div className="w-full h-[350px] overflow-hidden">
        {post.mediaType === "image" && (
          <img
            className="w-full h-full object-contain"
            src={post.media}
            alt=""
          />
        )}
        {post.mediaType === "video" && <VideoPlayer media={post.media} />}
      </div>

      <div className="flex w-full justify-between items-center mt-4 text-xl">
        <div className="flex gap-4 items-center">
          <div
            className="flex gap-1 items-center "
            onClick={() => handleLike(post._id)}
          >
            {post?.likes?.includes(user._id) ? (
              <FcLike className="cursor-pointer" />
            ) : (
              <FaRegHeart className="cursor-pointer" />
            )}
            <span>{post?.likes?.length}</span>
          </div>
          <div className="flex gap-1 items-center">
            <BiCommentDetail
              className="cursor-pointer"
              onClick={() => setIsCommentOpen(true)}
            />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div onClick={()=> handleSavedPost(post._id)}>
            {
                user.savedPosts?.includes(post._id) ? <IoMdBookmark className="cursor-pointer" /> :
        <FaRegBookmark className="cursor-pointer" />
            }
        </div>
      </div>

      <div
        className={`w-[410px] z-10 fixed transition-all duration-200 top-0 right-0  overflow-auto h-screen bg-gray-900 cursor-pointer px-4 py-10 text-white ${
          isCommentOpen ? "traslate-x-[410px]" : "translate-x-full"
        }`}
      >
        <div className="flex items-center font-semibold">
          <RxCross2 onClick={() => setIsCommentOpen(false)} />
          <p className="w-full text-center">Comments</p>
        </div>
        <div className="mt-10 flex flex-col gap-10 ">
          {post.comments.map((comment) => (
            <div className="flex gap-2 border-b border-b-gray-300 pb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={comment.author.profilePic} alt="" />
              </div>
              <div>
                <p>{comment.author.userName}</p>
                <p>{comment.message}</p>
              </div>
            </div>
          ))}
          <div></div>
        </div>
      </div>

      {post.caption && (
        <p className="flex gap-2 font-semibold">
          {post.author.userName}{" "}
          <span className="font-normal">{post.caption}</span>
        </p>
      )}

      <div className="flex w-full justify-between items-center">
        <div className="flex gap-2 items-center w-[90%]">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              className="w-full h-full  object-center"
              src={user.profilePic}
              alt=""
            />
          </div>
          <input
            className="outline-none border-b-2 border-black/50 pb-1 pt-2 w-full"
            type="text"
            placeholder="Enter comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <IoMdSend
          onClick={() => handleComment(post._id)}
          className="text-2xl cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Post;
