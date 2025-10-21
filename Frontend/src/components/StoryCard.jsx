import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { useSelector } from "react-redux";
import { IoEye } from "react-icons/io5";

const StoryCard = ({ storyData }) => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userSlice);
  const [showViewers, setShowViewers] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
      return () => clearInterval(interval);
    }, 150);
  }, [navigate]);

  return (
    <div className="w-[500px] relative h-screen border-l border-r border-gray-800">
      <div className="flex gap-3 text-white z-10  mt-5 pl-5 items-center absolute">
        <Link to={"/"}>
          <FaArrowLeftLong className="text-2xl" />
        </Link>
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-center">
            <img
              className="w-[40px] h-[40px] rounded-full"
              src={storyData?.author?.profilePic}
              alt=""
            />
            <p className="font-semibold">{storyData?.author?.userName}</p>
          </div>
        </div>
      </div>
      <div className="absolute top-0 w-full h-[5px]">
        <div
          className="h-full transition-all duration-200 ease-linear bg-white"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {!showViewers && (
        <>
          <div className="w-[100%] h-[90%] top-1 absolute">
            {storyData.mediaType === "image" && (
              <img
                className="w-full h-full object-center"
                src={storyData.media}
                alt=""
              />
            )}
            {storyData.mediaType === "video" && (
              <VideoPlayer media={storyData.media} />
            )}
          </div>
          {storyData?.author?._id === user._id && (
            <div onClick={()=> setShowViewers(true)} className=" w-full h-[70px] border-t-4 border-gray-700 bg-black cursor-pointer flex gap-2 justify-start absolute items-center bottom-0 px-5 py-5">
              <div className="flex gap-1 text-white items-center">
                <IoEye className="text-2xl" />
                <p className="text-2xl">{storyData?.viewers?.length}</p>
              </div>
              <div className="flex relative">
                {storyData.viewers?.slice(0, 3).map((story, index) => (
                  <div
                    className={`w-[40px] h-[40px] border-2 border-black rounded-full overflow-hidden ${
                      index > 0 ? `absolute left-[${index * 15}px]` : ""
                    }`}
                  >
                    <img
                      className="w-full h-full object-center"
                      src={
                        story?.profilePic ||
                        "https://api.dicebear.com/9.x/initials/svg?seed=U"
                      }
                      alt="avatar"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {
        showViewers && <>
        <div onClick={()=> setShowViewers(false)} className="w-full cursor-pointer h-[40%] mx-auto mt-20">
            {storyData.mediaType === "image" && (
              <img
                className="w-[50%] mx-auto h-[80%] object-center"
                src={storyData.media}
                alt=""
              />
            )}
            {storyData.mediaType === "video" && (
              <VideoPlayer media={storyData.media} />
            )}
          </div>
          <div className="flex flex-col gap-3 w-full px-5 mt-5">

          {
            storyData?.author?._id === user._id && 
          <div className="flex gap-3 text-white items-center
          ">
            <div className="flex gap-1 items-center">
                <IoEye className="text-lg" />
                <p className="text-lg">{storyData?.viewers?.length}</p>
            </div>
                <p>Viewers</p>
              </div>
          }
          {
            storyData.viewers.map((viewers)=> {
              return <div className="flex gap-2 text-white items-center">
            <img
              className="w-[40px] h-[40px] rounded-full"
              src={viewers.profilePic}
              alt=""
            />
            <p className="font-semibold">{viewers.userName}</p>
          </div>
            })
          }
          </div>
        </>
      }
    </div>
  );
};

export default StoryCard;
