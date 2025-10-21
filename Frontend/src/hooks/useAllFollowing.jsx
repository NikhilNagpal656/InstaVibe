/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {  setFollowing } from "../utils/userSlice";
import { serverUrl } from "../App";

const useAllFollowing = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/getfollowing` , {withCredentials : true});
      
       dispatch(setFollowing(res?.data))
       
      } catch (error) {
        console.log(error);
      }
    };
    fetchFollowing();
  }, []);
};

export default useAllFollowing;