import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";
import { CiHeart } from "react-icons/ci";
import axios from "axios";
import { setUserData } from "../utils/userSlice";
import { Link } from "react-router-dom";
import Button from "./Button";
import Notification from "../pages/Notification";
import { serverUrl } from "../App";

const LeftHome = () => {
  const { user, suggestedUser , notificationData } = useSelector((state) => state.userSlice);
  const [showNotification , setShowNotification] = useState(false)
  

  const dispatch = useDispatch();

 const handleLogOut = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/auth/signOut`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotification = () => {
    setShowNotification((prev)=> !prev)
  }

  return (
    <div className="lg:w-[25%] lg:block hidden overflow-auto pb-5 h-screen border-r border-gray-300 bg-black text-white px-4 py-2">
      <div className="flex justify-between w-full items-center">
        <img className="w-30" src={logo} alt="" />
        <div className="relative">
        <CiHeart className="text-3xl cursor-pointer" onClick={handleNotification} />
        {
          (notificationData.length > 0 && notificationData.some((noti)=> noti.isRead == false)) && 
        <div className="h-[10px] w-[10px] rounded-full bg-blue-600 absolute top-0 right-0"></div>
        }
        </div>
      </div>
      {
        !showNotification && <>
        <div className="flex justify-between items-center border-b border-gray-300 py-5">
          <Link to={`/userProfile/${user.userName}`}>
         <div className="flex items-center gap-2">
            <img
              className="rounded-full w-15 h-15"
              src={ user?.profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
              alt="avatar"
            />
            <div>
              <p>{user.name}</p>
              <p>{user.userName}</p>
            </div>
          </div>
          </Link>
          <button
            onClick={handleLogOut}
            className="bg-white px-3 cursor-pointer py-1 font-semibold text-black rounded-xl "
          >
            LogOut
          </button>
        </div>
      <div className="mt-5">
        <p className="font-medium text-xl">Suggested User</p>
        {suggestedUser && (
          <div>
            {suggestedUser.slice(0,3).map((user) => {
              return (
                <div className="flex justify-between items-center border-b border-gray-300 py-5">
                 <Link to={`/userProfile/${user.userName}`}>
                  <div className="flex items-center gap-2">
                    <img
                      className="rounded-full w-8 h-8"
                      src={user.profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                      alt="avatar"
                    />
                    <div>
                      <p>{user.name}</p>
                      <p>{user.userName}</p>
                    </div>
                  </div>
                 </Link>
                 <Button tailWind={"bg-white px-3 cursor-pointer py-1 font-semibold text-black rounded-xl "} id={user._id}/>
                </div>
              );
            })}
          </div>
        )}
      </div>    
        </>
      }
      {
        showNotification && 
          <Notification/>
      }
    </div>
  );
};

export default LeftHome;
