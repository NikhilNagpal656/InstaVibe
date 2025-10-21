import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationData } from "../utils/userSlice";
import { serverUrl } from "../App";

const useAllNotification = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  useEffect(() => {
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
    getAllNotification();
  }, [dispatch, user]);
};

export default useAllNotification;
