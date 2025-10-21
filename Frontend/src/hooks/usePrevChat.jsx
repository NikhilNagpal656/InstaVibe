/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPrevChat } from "../utils/messageSlice";
import { serverUrl } from "../App";

const usePrevChat = () => {
  const dispatch = useDispatch();
  const {userMessage} = useSelector((state)=> state.messageSlice)
  useEffect(() => {
    const fetchPrevChat = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/message/prevChats` , {withCredentials : true});
       dispatch(setPrevChat(res.data))
      } catch (error) {
        console.log(error);
      }
    };
    fetchPrevChat();
  }, [userMessage]);
};

export default usePrevChat;