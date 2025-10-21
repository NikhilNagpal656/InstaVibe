import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReelData } from "../utils/reelSlice";
import { serverUrl } from "../App";

const useAllReels = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllReels = async () => {
      const res = await axios.get(`${serverUrl}/api/reel/getreel`, {
        withCredentials: true,
      });
      dispatch(setReelData(res.data));
    };

    fetchAllReels();
  }, [dispatch])
};

export default useAllReels;