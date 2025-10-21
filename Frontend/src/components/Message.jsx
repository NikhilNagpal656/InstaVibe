import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import OnlineUser from "./OnlineUser";
import { useDispatch, useSelector } from "react-redux";
import { setMessageData } from "../utils/messageSlice";

const Message = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((state) => state.socketSlice);
  const { user } = useSelector((state) => state.userSlice);
  const { prevChatUser } = useSelector((state) => state.messageSlice);

  return (
    <div className="w-full bg-black min-h-screen flex flex-col  relative">
      <div className="cursor-pointer flex gap-5 absolute left-5 top-5">
        <FaArrowLeftLong
          onClick={() => navigate("/")}
          className="text-white text-2xl lg:hidden"
        />
        <p className="text-white text-xl">Messages</p>
      </div>
      <div className="w-full h-[80px] flex items-center gap-[20px] mt-12 pl-5 border-b overflow-auto border-gray-600">
        {user?.following?.map(
          (user) =>
            onlineUsers?.includes(user._id) && <OnlineUser user={user} />
        )}
      </div>
      {prevChatUser && (
        <div className="w-full h-full p-5
         overflow-auto flex flex-col gap-[20px]">
          {prevChatUser.map((user) => (
            <div
              className="text-white cursor-pointer w-full items-center flex gap-[10px]"
              onClick={() => {
                dispatch(setMessageData(user));
                navigate("/messageArea");
              }}
            >
              {
                onlineUsers?.includes(user._id) ? <OnlineUser user={user}/> : <div className="w-[50px] h-[50px] overflow-hidden rounded-full">
                  <img className="w-full h-full object-center" src={user.profilePic ||`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`} alt="" />
                </div>
              }

              <div>
                <p className="font-semibold">{user.userName}</p>
                {
                  onlineUsers?.includes(user._id) && <p className="text-sm text-blue-600">Active now</p>
                }
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;
