import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setToggleFollow } from '../utils/userSlice';
import { serverUrl } from '../App';

const Button = ({id , tailWind , onFollow}) => {

  const {following} = useSelector((state)=> state.userSlice)
  const dispatch = useDispatch()

  const isFollowing = following.includes(id)
    const handleFollow = async (id) => {
    try {
      await axios.get(
        `${serverUrl}/api/post/followUser/${id}`,
        { withCredentials: true }
      );
      if(onFollow){
        onFollow()
      }
      dispatch(setToggleFollow(id))
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className={tailWind} onClick={()=> handleFollow(id)}>
        {isFollowing ? "Following" : "Follow"}
    </button>
  )
}

export default Button