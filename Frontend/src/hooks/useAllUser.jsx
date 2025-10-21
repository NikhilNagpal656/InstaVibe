/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUser } from "../utils/userSlice";
import { serverUrl } from "../App";

const useAllUser = () => {
  const dispatch = useDispatch();
  const { user  } = useSelector((state) => state.userSlice);

  useEffect(() => {
    const fetchAllUser = async () => {
      const res = await axios.get(`${serverUrl}/api/user/getAllUser`, {
        withCredentials: true,
      });
      dispatch(setSuggestedUser(res.data.user));
    };

    fetchAllUser();
  }, [user]);
};

export default useAllUser;
