/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {  setUserData } from "../utils/userSlice";
import { setCurrentUserStory } from "../utils/storySlice";
import { serverUrl } from "../App";

const useCurrentUser = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/getuser` , {withCredentials : true});
        dispatch(setUserData(res.data.user))
       dispatch(setCurrentUserStory(res.data.user.story))
       
      } catch (error) {
        console.log(error);
      }
    };
    fetchuser();
  }, []);
};

export default useCurrentUser;
