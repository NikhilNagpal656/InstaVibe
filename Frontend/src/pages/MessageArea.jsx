/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaRegImage } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { setUserMessage } from "../utils/messageSlice";
import SenderMessage from "../components/SenderMessage";
import RecieverMessage from "../components/RecieverMessage";
import { serverUrl } from "../App";

const MessageArea = () => {
  const { messageData, userMessage } = useSelector(
    (state) => state.messageSlice
  );
  const { socketData } = useSelector((state) => state.socketSlice);
  const { user } = useSelector((state) => state.userSlice);
  const imageInput = useRef();
  const [input, setInput] = useState("");
  const [frontendImage, setFrontEndImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const dispatch = useDispatch();

  const handleImage = (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontEndImage(URL.createObjectURL(file));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("message", input);
    if (backendImage) {
      formData.append("media", backendImage);
    }
    try {
      const res = await axios.post(
        `${serverUrl}/api/message/sendMessage/${messageData._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setUserMessage([...userMessage, res.data]));
      setInput("");
      setBackendImage("");
      setFrontEndImage("");
    } catch (error) {
      console.log(error);
    }
  };
  const getMessage = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/message/getMessage/${messageData._id}`,
        { withCredentials: true }
      );
      dispatch(setUserMessage(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessage();
  }, []);

  useEffect(() => {
    if(socketData){
      socketData?.on("newMessage",(mess)=>(
        dispatch(setUserMessage([...userMessage , mess]))
      ))
    }

    return ()=> socketData?.off("newMessage")
  }, [userMessage, setUserMessage]);

  return (
    <div className="w-full h-screen bg-black">
      <div className="w-full h-[80px] flex z-10 bg-black items-center px-[20px] border-b border-gray-800 fixed top-0 ">
        <div className=" flex items-center gap-[15px]">
          <Link to={"/"}>
            <FaArrowLeftLong className="text-white text-2xl" />
          </Link>
          <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
            <img
              className="w-full h-full object-center"
              src={
                messageData?.profilePic ||
                `https://api.dicebear.com/9.x/initials/svg?seed=${messageData?.name}`
              }
              alt=""
            />
          </div>
          <div className="flex flex-col text-white">
            <p className="font-semibold text-xl">{messageData.name}</p>
            <p className="font-small text-md text-gray-400">
              {messageData.userName}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[85%] pt-[100px] pb-[80px]  px-[40px] flex flex-col gap-[50px] overflow-auto  bg-black">
        {userMessage &&
          userMessage.map((mess) =>
            mess.sender == user._id ? (
              <SenderMessage message={mess} />
            ) : (
              <RecieverMessage message={mess} />
            )
          )}
      </div>

      <div className="w-full h-[90px] flex justify-center items-center fixed bottom-0 border-t border-gray-800">
        <div className="w-[95%] lg:w-[60%] flex justify-center relative items-center px-5 py-2 mx-auto h-[80%] rounded-full bg-gray-600">
          {frontendImage && (
            <div className="w-[100px] h-[100px] absolute right-0 bottom-[100px]">
              <img
                className="w-full h-full object-center"
                src={frontendImage ? frontendImage : null}
                alt=""
              />
            </div>
          )}
          <form className="w-full flex items-center justify-between">
            <input
              className="w-[80%] text-white h-full outline-none placeholder:text-white border-none"
              type="text"
              placeholder="Enter Message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={imageInput}
              onChange={handleImage}
            />
            <div className="flex gap-[15px] items-center cursor-pointer">
              <FaRegImage
                className="text-3xl text-white"
                onClick={() => imageInput.current.click()}
              />
              {(input || frontendImage) && (
                <button
                  onClick={sendMessage}
                  className="text-3xl cursor-pointer text-white"
                >
                  <IoSend />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;
