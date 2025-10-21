import React, { useEffect, useState } from 'react'
import { FaCirclePlus } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';

const StoryDp = ({userName ,profilePic, story}) => {
 const navigate = useNavigate()
 const { user } = useSelector((state) => state.userSlice)
 const { storyData , allStroy } = useSelector((state) => state.storySlice)
 const [viewOnStory ,setViewOnStory ] = useState(false)

  const viewStroy = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/story/viewers/${story._id}` , {withCredentials : true})
      console.log(res.data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleStory = () => {
    if(!story && userName === "Your Story"){
        navigate("/upload")
    }else if(story && userName === "Your Story"){
      viewStroy()
      navigate(`/story/${user.userName}`)
    }else{
      viewStroy()
      navigate(`/story/${userName}`)
    }
  }
  

  useEffect(()=> {
   if(story?.viewers?.some((view)=> view?._id?.toString() === user._id?.toString() || view?.toString() === user?._id?.toString())){
    setViewOnStory(true)
   }else{
    setViewOnStory(false)
   }
  },[
    story , user , storyData , allStroy 
  ])

  

 
  
  return (
    <div className='flex flex-col items-center justify-center  w-[80px] gap-1 '>
        <div className={`w-[80px] relative h-[80px] rounded-full ${story ? !viewOnStory ? "bg-gradient-to-b from-blue-500 to-blue-950" : "bg-gradient-to-b from-gray-600 to-black" : ""} flex flex-col justify-center items-center`}>
        <div className='w-[70px] h-[70px] rounded-full cursor-pointer '  onClick={handleStory} >
            <img
              className="rounded-full w-full h-full"
              src={profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${user}`}
              alt="avatar"
            />
        </div>
        {
          !story && userName === "Your Story" && <FaCirclePlus className='absolute w-7 h-7 bottom-0 right-0' />
        }
    </div>
    <p className=' truncate w-full text-center'>{userName}</p>
    </div>
  )
}

export default StoryDp  