/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuUserPlus } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidUserPlus } from "react-icons/bi";
import { setProfileData } from "../utils/userSlice";
import Button from "../components/Button";
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FaRegPlusSquare } from "react-icons/fa";
import { TbPhotoVideo } from "react-icons/tb";
import Post from "../components/Post";
import { setMessageData } from "../utils/messageSlice";
import { serverUrl } from "../App";

const UserProfile = () => {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { user, profileData, suggestedUser } = useSelector(
    (state) => state.userSlice
  );
  const { postData } = useSelector(
    (state) => state.postSlice
  );
  const [showOtherUser, setShowOtherUser] = useState(false);
  const [postType , setPostType] = useState("Posts")
  const navigate = useNavigate();

   const fetchUserProfile = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/get-profile/${userName}`,
          { withCredentials: true }
        );
        dispatch(setProfileData(result.data.user));
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchUserProfile();
  }, [userName , dispatch])

  return (
    <div className="bg-gray-900 w-full min-h-screen flex flex-col md:flex-row lg:flex-row md:justify-between px-4 md:px-10 py-5">
      <div>
        <Link to={"/"}>
          <FaArrowLeftLong className="text-white text-2xl" />
        </Link>
      </div>
      {profileData ? (
        <div className="text-white  flex flex-col gap-2 px-1 py-5 md:w-[550px] w-full">
          <p className="md:pl-15 text-2xl">{profileData.userName}</p>
          <div className="md:px-15 w-full md:gap-10 mt-5 flex justify-between items-center">
            <div className="w-32 h-32 rounded-full ">
              <img
                className="rounded-full w-full h-full object-center"
                src={
                  profileData.profilePic
                    ? profileData.profilePic
                    : `https://api.dicebear.com/9.x/initials/svg?seed=${profileData.name}`
                }
                alt="avatar"
              />
            </div>
            <div>
              <p className="font-medium">{profileData.name}</p>
              <p className="font-light text-sm mb-5">
                {profileData.profession}
              </p>
              <div className="flex gap-10 mt-3">
                <div className="flex flex-col gap-1">
                  <p>{profileData.posts.length}</p>
                  <p>Posts</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-center gap-4">
                    <div className=" flex gap-1 relative">
                      {profileData.followers?.map((user , index) => (
                          <div className={`w-[25px] h-[25px] border-2 border-black  rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index*13}px]` : ""}`}>
                          <img
                         className="w-full h-full object-center"
                         src={user.profilePic || "https://api.dicebear.com/9.x/initials/svg?seed=U"}
                         alt="avatar"
                       />
                        </div>
                      ))}
                    </div>
                    <p>{profileData.followers.length}</p>
                  </div>
                  <p>followers</p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-center items-center gap-4">
                    <div className="flex relative">
                      {profileData.following?.slice(0,3).map((user , index) => (
                        
                        
                        <div className={`w-[25px] h-[25px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index * 13}px]` : ""}`}>
                          <img
                         className="w-full h-full object-center"
                         src={user.profilePic || "https://api.dicebear.com/9.x/initials/svg?seed=U"}
                         alt="avatar"
                       />
                        </div>
                      ))}
                    </div>
                    <p>{profileData.following.length}</p>
                  </div>
                  <p>following</p>
                </div>
              </div>
            </div>
          </div>
          <p className=" py-3">{profileData.bio}</p>
          <div className="text-white flex justify-between gap-4  mt-3 items-center">
            {profileData?._id === user._id ? (
              <>
                <button
                  onClick={() => navigate("/edit-Profile")}
                  className="bg-white flex-1 text-black font-semibold px-6 py-2 rounded-xl cursor-pointer"
                >
                  Edit Profile
                </button>
                <button className="bg-white flex-1 text-black font-semibold px-6 py-2 rounded-xl cursor-pointer">
                  Share Profile
                </button>
              </>
            ) : (
              <>
                <Button
                  tailWind={
                    "bg-white flex-1 text-black font-semibold px-6 py-2 rounded-xl cursor-pointer"
                  }
                  id={profileData._id} onFollow={fetchUserProfile}
                />
                <button onClick={()=> {
                  dispatch(setMessageData(profileData))
                  navigate("/messageArea")}} className="bg-white flex-1 text-black font-semibold px-6 py-2 rounded-xl cursor-pointer">
                  Message
                </button>
              </>
            )}
            {!showOtherUser ? (
              <LuUserPlus
                onClick={() => setShowOtherUser((prev) => !prev)}
                className="bg-white cursor-pointer text-black w-[35px] h-[35px] p-1 rounded-sm"
              />
            ) : (
              <BiSolidUserPlus
                onClick={() => setShowOtherUser((prev) => !prev)}
                className="bg-white cursor-pointer text-black w-[35px] h-[35px] p-1 rounded-sm"
              />
            )}
          </div>
          {showOtherUser && (
            <div className="flex flex-col gap-2  mt-4">
              <div className="flex justify-between">
                <p>Descover People</p>
                <p>see All</p>
              </div>
              <div className="flex gap-5">
                {suggestedUser &&
                  suggestedUser.slice(0, 10).map((user) => {
                    return (
                      <div className="bg-white shadow-sm text-black rounded-lg shadow-black/40 w-[120px] border-2 border-black/50 py-2 px-1 justify-between items-center flex flex-col gap-2">
                        <img
                          className="rounded-full w-24 h-24 border-2 border-black"
                          src={
                            user.profilePic ||
                            `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`
                          }
                          alt="avatar"
                        />
                        <div className="flex flex-col w-full gap-1 text-center">
                          <p className="font-semibold text-sm">{user.name}</p>
                          <button className="bg-blue-500 cursor-pointer text-white py-1 font-semibold  rounded-sm">
                            Follow
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          <div className="w-full bg-white min-h-screen flex flex-col items-center mt-5 pb-5 rounded-tl-4xl rounded-tr-4xl">
            {
              profileData._id === user._id && <div className=" flex gap-15 pt-10">
              <button onClick={()=>setPostType("Posts")} className={`shadow-sm shadow-black text-black hover:bg-black hover:text-white w-[150px] px-5 py-2 rounded-full font-semibold cursor-pointer ${postType == "Posts" ? "bg-black text-white" : ""}`}>Posts</button>
              <button onClick={()=>setPostType("Saved")} className={`shadow-sm shadow-black text-black hover:bg-black hover:text-white w-[150px] px-5 py-2 rounded-full font-semibold cursor-pointer ${postType == "Saved" ? "bg-black text-white" : ""}`}>Saved</button>
            </div>
            }
             <div className='w-full pb-25'>
          { postType == "Posts" &&
           postData?.map((post)=>(
            post.author._id == profileData._id &&  <Post post={post}/>

            ) )
          }
          {
            postType == "Saved" &&
            postData.map((post)=> (
              user.savedPosts.includes(post._id) && <Post post={post}/>
            ))
          }
          
        </div>
       
        <div className="bg-black w-[80%] lg:w-[30%] flex justify-around text-white items-center px-4 py-2  h-[10%] fixed  bottom-[25px] rounded-full shadow-md shadow-black/50">
          <div>
            <GoHomeFill className="w-7 h-7" />
          </div>
          <div>
            <IoSearch className="w-7 h-7" />
          </div>
         <Link to={"/upload"}>
          <div >
            <FaRegPlusSquare className="w-7 h-7" />
          </div>
         </Link>
          <div>
            <TbPhotoVideo className="w-7 h-7" />
          </div>
         <Link to={`/userProfile/${user.userName}`}>
          <div>
            <img
              className="rounded-full w-7 h-7"
              src={ user.profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
              alt="avatar"
            />
          </div>
         </Link>
        </div>

          </div>
        </div>
      ) : (
        <h1>Loading ....</h1>
      )}
      <div>
        <button className="bg-white fixed top-5 right-5 px-3 cursor-pointer py-1 font-semibold text-black rounded-xl ">
          LogOut
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
