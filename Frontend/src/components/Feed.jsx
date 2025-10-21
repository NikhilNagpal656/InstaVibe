import React from "react";
import logo from "../assets/logo.png";
import { CiHeart } from "react-icons/ci";
import StoryDp from "./StoryDp";
import { useSelector } from "react-redux";
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FaRegPlusSquare } from "react-icons/fa";
import { TbPhotoVideo } from "react-icons/tb";
import { RiMessage2Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import Post from "./Post";

const Feed = () => {
  const { user , notificationData} = useSelector((state) => state.userSlice);
  const { postData } = useSelector((state) => state.postSlice);
  const { allStroy , currentUserStory } = useSelector((state) => state.storySlice);
  const navigate = useNavigate()
  
  return (
    <div className="lg:w-[50%] w-full h-screen overflow-y-auto relative border-r border-gray-300 bg-black text-white px-6">
      <div className="flex justify-between lg:hidden w-full items-center">
        <img className="w-30" src={logo} alt="" />
        <div className="flex items-center gap-[15px]">
        <div className="relative">
                <CiHeart className="text-3xl" onClick={()=> navigate("/notification")} />
                {
                  (notificationData.length > 0 && notificationData.some((noti)=> noti.isRead == false)) && 
                <div className="h-[10px] w-[10px] rounded-full bg-blue-600 absolute top-0 right-0"></div>
                }
                </div>
       <Link to={"/message"}><RiMessage2Line className="text-2xl"  /></Link>
        </div>
      </div>
      <div className="lg:mt-8 flex gap-5 overflow-x-auto items-center">
        <StoryDp userName={"Your Story"} profilePic={user.profilePic} story={currentUserStory} />
        {
          allStroy?.map((story)=> {
            return <StoryDp userName={story.author.userName} profilePic={story.author.profilePic} story={story} />
          })
        }
      </div>
      <div className="w-full bg-white min-h-full flex justify-center mt-5 pb-5 rounded-tl-4xl rounded-tr-4xl">
        <div className='w-full pb-25'>
          {
            postData?.map((post)=>(
              <Post post={post}/>

            ) )
          }
        </div>
       
        <div className="bg-black w-[80%] lg:w-[30%] flex justify-around text-white items-center px-4 py-2  h-[10%] fixed  bottom-[25px] rounded-full shadow-md shadow-black/50">
          <div>
            <GoHomeFill className="w-7 h-7" />
          </div>
          <div>
           <Link to={"/search"}>
            <IoSearch className="w-7 h-7" />  
           </Link>
          </div>
         <Link to={"/upload"}>
          <div >
            <FaRegPlusSquare className="w-7 h-7" />
          </div>
         </Link>
          <div>
          <Link to={"/reels"}>  <TbPhotoVideo className="w-7 h-7" /></Link>
          </div>
         <Link to={`/userProfile/${user.userName}`}>
          <div>
            <img
              className="rounded-full w-7 h-7"
              src={ user.profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
              alt="avatar"
            />
          </div>
         </Link>
        </div>
      </div>
    </div>
  );
};

export default Feed;
