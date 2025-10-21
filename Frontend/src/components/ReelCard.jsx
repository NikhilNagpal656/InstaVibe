/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { FaRegHeart, FaVolumeUp } from "react-icons/fa";
import { FaVolumeXmark } from "react-icons/fa6";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { FcLike } from "react-icons/fc";
import { BiCommentDetail } from "react-icons/bi";
import axios from "axios";
import { setReelData } from "../utils/reelSlice";
import { RxCross2 } from "react-icons/rx";
import { IoMdSend } from "react-icons/io";
import { serverUrl } from "../App";

const ReelCard = ({ reel }) => {
  const videoRef = useRef();
  const { user } = useSelector((state) => state.userSlice);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mute, setMute] = useState(true);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const { reelData } = useSelector((state) => state.reelSlice);
  const [comment, setComment] = useState("");
  // const [heart, setHeart] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
   const { socketData } = useSelector((state) => state.socketSlice);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMute = (e) => {
    e.stopPropagation();
    setMute((prev) => !prev);
  };

  const handleTime = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/reel/likeReel/${id}`,
        {},
        { withCredentials: true }
      );
      const reel = res.data;
      const likePost = reelData.map((p) => (p._id == id ? reel : p));
      dispatch(setReelData(likePost));
    } catch (error) {
      console.log(error);
    }
  };
  const handleComment = async (id) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/reel/commentReel/${id}`,
        { comment },
        { withCredentials: true }
      );
      const reel = res.data;
      const commnetPost = reelData.map((p) => (p._id == id ? reel : p));
      dispatch(setReelData(commnetPost));
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

   useEffect(()=>{
    socketData?.on("likeReel",(updated)=>{
      const likeReel = reelData.map((p) => (p._id == updated.reelId ? {...p ,likes : updated.like} : p))
      dispatch(setReelData(likeReel))
  })
    socketData?.on("commentReel",(updated)=>{
      const commnetReel = reelData.map((p) => (p._id == updated.reelId ? {...p ,comments : updated.comment} : p))
      dispatch(setReelData(commnetReel))
  })
  return ()=> {
    socketData?.off("likeReel")
    socketData?.off("commentReel")
  }
  },[dispatch ,reelData , socketData])


  const commnetRef = useRef()

  const handleMouseDown = (e) => {
      if(commnetRef.current && !commnetRef.current.contains(e.target)){
        setIsCommentOpen(false)
      }
  }

  useEffect(()=>{
    if(isCommentOpen){
      document.addEventListener("mousedown" , handleMouseDown)
    }

    return () => {
      document.removeEventListener("mousedown",handleMouseDown)
    }
  },[isCommentOpen])
  return (
    <div className="w-full max-w-[500px] mx-auto h-screen flex items-center justify-center relative   border-l-2 border-r-2 border-gray-800">
      <video
        onClick={handlePlay}
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted={mute}
        src={reel.media}
        onTimeUpdate={handleTime}
      ></video>
      <div
        onClick={handleMute}
        className="absolute   cursor-pointer top-[20px] right-[20px]"
      >
        {!mute ? (
          <FaVolumeUp className=" text-white font-semibold  text-2xl" />
        ) : (
          <FaVolumeXmark className="text-white font-semibold text-2xl" />
        )}
      </div>
      <div className="absolute bottom-0 w-full h-[5px]">
        <div
          className="h-full transition-all duration-300 ease-linear bg-white"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="absolute w-full h-[100px] bottom-[5px] p-[10px] flex flex-col gap-1.5 z-[100]">
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-start">
            <img
              className="w-[40px] h-[40px] rounded-full"
              src={reel.author.profilePic}
              alt=""
            />
            <p className="text-white font-semibold">{reel.author.userName}</p>
          </div>
          {reel.author._id !== user._id && (
            <Button
              id={reel.author._id}
              tailWind={
                "w-[120px] py-1  text-white border-white border rounded-2xl cursor-pointer"
              }
            />
          )}
        </div>
        <p className="text-white">{reel.caption}</p>
      </div>
      <div className="absolute z-[100] right-0 bottom-[100px] text-white pr-[15px] text-2xl flex flex-col gap-3">
        <div
          className="flex flex-col items-center "
          onClick={() => handleLike(reel._id)}
        >
          {reel.likes.includes(user._id) ? (
            <FcLike className="cursor-pointer" />
          ) : (
            <FaRegHeart className="cursor-pointer" />
          )}
          <span>{reel.likes.length}</span>
        </div>
        <div
          className="flex flex-col items-center"
          onClick={() => setIsCommentOpen(true)}
        >
          <BiCommentDetail className="cursor-pointer" />
          <span>{reel.comments.length}</span>
        </div>
      </div>
      <div ref={commnetRef}
        className={`w-full  z-[1000] absolute transition-all duration-300 ease-in-out  bottom-0   h-[500px] bg-gray-800  text-white ${
          isCommentOpen ? "translate-y-0 " : "translate-y-[100%] invisible "
        }`}
      >
        <div className="flex items-center font-semibold px-5 py-2">
          <RxCross2 className="cursor-pointer text-xl" onClick={() => setIsCommentOpen(false)} />
          <p className="w-full text-center">Comments</p>
        </div>

        <div  className="flex w-full mx-auto absolute bottom-0 px-3 z-[1000] bg-gray-900 h-[120px]  gap-[30px] items-center">
          <div className="flex gap-3 items-center w-[80%]">
            <div className="w-11 h-11 rounded-full shrink-0 ">
              <img
                className="w-full h-full rounded-full  object-center"
                src={user.profilePic}
                alt=""
              />
            </div>
            <input
              className="outline-none border-b-2 border-white placeholder:text-white pb-1 pt-2 w-full"
              type="text"
              placeholder="Enter comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <IoMdSend
            onClick={() => handleComment(reel._id)}
            className="text-2xl cursor-pointer"
          />
        </div>
        <div className="mt-3 pb-4 flex flex-col gap-10  overflow-scroll h-[380px] ">
          {reel.comments.map((comment) => (
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
    </div>
  );
};

export default ReelCard;
