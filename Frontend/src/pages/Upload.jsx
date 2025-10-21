import React, { useRef, useState } from "react";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../utils/postSlice";
import { setReelData } from "../utils/reelSlice";
import { setCurrentUserStory } from "../utils/storySlice";
import { serverUrl } from "../App";

const Upload = () => {
  const [uploadType, setUploadType] = useState("Post");
  const mediaInput = useRef();
  const [frontEndMedia, setFrontEndMedia] = useState(null);
  const [backendMedia, setBackEndMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setMediaType("image");
    } else {
      setMediaType("video");
    }
    setBackEndMedia(file);
    setFrontEndMedia(URL.createObjectURL(file));
  };

  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.postSlice);
  const { reelData } = useSelector((state) => state.reelSlice);
  const uploadPost = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("mediaType", mediaType);
    formData.append("media", backendMedia);
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/uploadpost`,
        formData,
        { withCredentials: true }
      );
      dispatch(setPostData([...postData, res.data]));
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const uploadStory = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("mediaType", mediaType);
    formData.append("media", backendMedia);
    try {
     const res =    await axios.post(
        `${serverUrl}/api/story/uploadStory`,
        formData,
        { withCredentials: true }
      );
      dispatch(setCurrentUserStory(res.data))
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const uploadreel = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("media", backendMedia);
    try {
      const res = await axios.post(
        `${serverUrl}/api/reel/uploadreel`,
        formData,
        { withCredentials: true }
      );
      dispatch(setReelData([...reelData, res.data]));
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleUpload = () => {
    if (uploadType === "Post") {
      uploadPost();
    } else if (uploadType === "Story") {
      uploadStory();
    } else {
      uploadreel();
    }
  };

  return (
    <div className="bg-gray-900 w-full min-h-screen flex flex-col items-start gap-5 px-5 pb-10 ">
      <div className="flex gap-5 items-center px-[20px] h-[80px]">
        <Link to={"/"}>
          <FaArrowLeftLong className="text-white text-2xl" />
        </Link>
        <p className="font-semibold text-white text-xl">upload media</p>
      </div>
      <div className="w-[80%] max-w-[600px] mx-auto rounded-full bg-white text-black flex justify-around items-center font-semibold h-[80px]">
        <p
          onClick={() => {
            setFrontEndMedia("");
            setUploadType("Post");
          }}
          className={`w-[30%] h-[80%] flex justify-center items-center hover:bg-black hover:text-white hover:rounded-full cursor-pointer ${
            uploadType === "Post" ? "bg-black text-white rounded-full" : ""
          }`}
        >
          Post
        </p>
        <p
          onClick={() => {
            setFrontEndMedia("");
            setUploadType("Reel");
          }}
          className={`w-[30%] h-[80%] flex justify-center items-center hover:bg-black hover:text-white hover:rounded-full cursor-pointer ${
            uploadType === "Reel" ? "bg-black text-white rounded-full" : ""
          }`}
        >
          Reel
        </p>
        <p
          onClick={() => {
            setFrontEndMedia("");
            setUploadType("Story");
          }}
          className={`w-[30%] h-[80%] flex justify-center items-center hover:bg-black hover:text-white hover:rounded-full cursor-pointer ${
            uploadType === "Story" ? "bg-black text-white rounded-full" : ""
          }`}
        >
          Story
        </p>
      </div>
      {!frontEndMedia && (
        <div
          onClick={() => mediaInput.current.click()}
          className="w-[80%] cursor-pointer max-w-[500px] h-[500px] flex flex-col gap-1 justify-center items-center rounded-2xl text-white mx-auto bg-gray-700"
        >
          <FaRegPlusSquare className="w-7 h-7" />
          <p>Upload {uploadType}</p>
          <input
            accept={uploadType === "Reel" ? "video/*" : ""}
            type="file"
            className="hidden"
            ref={mediaInput}
            onChange={handleMedia}
          />
        </div>
      )}
      {frontEndMedia && (
        <div
          onClick={() => mediaInput.current.click()}
          className="w-[80%] cursor-pointer max-w-[500px] h-[500px] flex flex-col gap-1 justify-center items-center overflow-hidden text-white mx-auto rounded-2xl  mt-5"
        >
          {mediaType === "image" && (
            <img
              className="h-[100%] w-[100%] rounded-2xl object-center"
              src={frontEndMedia}
              alt=""
            />
          )}
          {mediaType === "video" && <VideoPlayer media={frontEndMedia} />}
        </div>
      )}
      {uploadType !== "Story" && (
        <input
          type="text"
          onChange={(e) => setCaption(e.target.value)}
          className="border-b border-gray-400 outline-none w-[80%] max-w-[450px] mx-auto placeholder:text-white text-white py-2"
          placeholder="Enter Caption"
        />
      )}
      {frontEndMedia && (
        <button
          onClick={handleUpload}
          className="font-semibold w-[80%] lg:max-w-[20%] max-w-[60%] mx-auto py-2 px-4 mb-10 bg-white text-black rounded-full cursor-pointer mt-5"
        >
          {loading ? (
            <ClipLoader color="#000" size={25} />
          ) : (
            `Upload ${uploadType}`
          )}
        </button>
      )}
    </div>
  );
};

export default Upload;
