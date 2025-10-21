/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from "axios"
import { setNotificationData } from '../utils/userSlice'
import { serverUrl } from '../App'

const Notification = () => {
    const {notificationData} = useSelector(
    (state) => state.userSlice)
    const ids = notificationData.map(n => n._id)
    const dispatch = useDispatch()


    const getAllNotification = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/user/getNotification`,
          { withCredentials: true }
        );

        dispatch(setNotificationData(res?.data));
      } catch (error) {
        console.log(error);
      }
    };

    const markAsRead = async () => {
        try {
            await axios.post(`${serverUrl}/api/user/markasread` , {notificationId : ids}, {withCredentials : true})
            getAllNotification()
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=> {
        markAsRead()
    },[])
  return (
    <div className='w-full min-h-[100vh] bg-black flex  flex-col items-start  gap-5 justify-start'>
        <div className='flex p-5 text-white text-xl gap-4 items-center lg:hidden'>
        <Link to={"/"}>
          <FaArrowLeftLong />
        </Link>
        <p>Notifications</p>
      </div>
      <div className='w-full flex flex-col gap-[10px] pb-5'>
        {
            notificationData.map((noti)=>(
                <div className='flex justify-between px-2 py-1 items-center w-full bg-gray-800 rounded-full min-h-[60px]'>
                    <div className='flex gap-2 items-center'>
                    <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                    <img className='w-full h-full object-center' src={noti.sender.profilePic} alt="" />
                    </div>
                    <div>
                        <p className='text-md font-semibold'>{noti.sender.userName}</p>
                        <p className='text-sm text-gray-400'>{noti.message}</p>
                    </div>
                    </div>
                    <div className='w-[50px] h-[50px] rounded-full border-4 overflow-hidden border-gray-900'>
                        {
                            noti?.reel ? <video className='w-full h-full object-cover' src={noti?.reel?.media}></video> : noti?.post?.mediaType == "image" ? <img className='w-full h-full object-cover' src={noti?.post?.media} alt="" /> : <video className='w-full h-full object-cover' src={noti?.post?.media}></video>
                        }
                    </div>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default Notification