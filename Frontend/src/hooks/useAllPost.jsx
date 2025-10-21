import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../utils/postSlice";
import { serverUrl } from "../App";

const useAllPost = () => {
  const dispatch = useDispatch();
  const  {user}  = useSelector((state) => state.userSlice);

  useEffect(() => {
    const fetchAllPost = async () => {
      const res = await axios.get(`${serverUrl}/api/post/getpost`, {
        withCredentials: true,
      });
      dispatch(setPostData(res.data));
    };

    fetchAllPost();
  }, [dispatch , user]);
};

export default useAllPost;