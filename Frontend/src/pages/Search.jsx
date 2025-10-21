/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setSearch } from "../utils/userSlice";
import { serverUrl } from "../App";

const Search = () => {
  const [input, setinput] = useState("");
  const dispatch = useDispatch();
  const { searchUser } = useSelector((state) => state.userSlice);
  const navigate = useNavigate()

  const handleSearch = async () => {
    const res = await axios.get(
      `${serverUrl}/api/user/searchuser?keyword=${input}`,
      { withCredentials: true }
    );
    dispatch(setSearch(res.data))
  };

  useEffect(()=> {handleSearch()}, [input])

  return (
    <div className="w-full min-h-screen bg-black flex flex-col p-5">
      <div className="flex items-center gap-[10px] text-white">
        <Link to={"/"}>
          <FaArrowLeftLong className="text-white text-2xl" />
        </Link>
        <p>Search</p>
      </div>
      <div
        
        className="w-full max-w-[800px] mx-auto h-[70px] bg-gray-800 rounded-full flex items-center justify-center"
      >
        <input
          className="w-[90%] h-[90%] text-white placeholder:text-white px-5 outline-none border-none"
          type="text"
          placeholder="Search for User"
          onChange={(e) => setinput(e.target.value)}
          value={input}
        />
        <IoSearch className="w-7 h-7 text-white" />
      </div>
      <div className="w-full max-w-[700px] mt-10 mx-auto flex flex-col gap-[20px]">
        {
        input &&  searchUser && searchUser.map((user)=> (
            <div onClick={()=> navigate(`/userProfile/${user.userName}`)} className="w-full h-[70px] px-5 py-1 bg-white hover:bg-gray-400 text-black flex items-center justify-start rounded-full gap-[10px] cursor-pointer ">
              <div className="w-[50px] h-[50px] overflow-hidden rounded-full">
              <img src={user.profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`} alt="" />
              </div>
              <div>
                <p className="font-semibold">{user.userName}</p>
                <p className="font-medium text-sm text-gray-700">{user.name}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Search;
