import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../utils/userSlice";
import { serverUrl } from "../App";

const SignIn = () => {
  const navigate = useNavigate();
  const [onDivClick, setOnDivClick] = useState({
    userName: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authData, setAuthData] = useState({
    userName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signIn`,
        authData,
        { withCredentials: true }
      );
      dispatch(setUserData(res.data))
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-amber-50">
      <div className="w-[65%] h-[75%] mx-auto flex rounded-2xl overflow-hidden shadow-sm shadow-black/40">
        <div className="w-[50%] h-full flex flex-col gap-7 justify-center items-center bg-white px-10 py-10">
          <h2 className="text-2xl font-semibold">
            Sign In to{" "}
            <span className="font-semibold text-orange-500">InstaVibe</span>
          </h2>
          <div
            className="w-full border-2 border-black transition-all cursor-pointer duration-200 relative rounded-xl px-5 py-3"
            onClick={() => setOnDivClick({ ...onDivClick, userName: true })}
          >
            <label
              className={`absolute cursor-pointer text-zinc-600 bg-white px-3  ${
                onDivClick.userName ? "top-[-15px]" : ""
              }`}
              htmlFor="username"
            >
              Enter Your Username
            </label>
            <input
              value={authData.userName}
              onChange={(e) =>
                setAuthData((prev) => ({ ...prev, userName: e.target.value }))
              }
              className="w-full  outline-none border-none  h-full z-10"
              type="text"
              id="username"
              required
            />
          </div>
          <div
            className="w-full border-2 border-black transition-all cursor-pointer duration-200 relative rounded-xl px-5 py-3"
            onClick={() => setOnDivClick({ ...onDivClick, password: true })}
          >
            <label
              className={`absolute cursor-pointer text-zinc-600 bg-white px-3  ${
                onDivClick.password ? "top-[-15px]" : ""
              }`}
              htmlFor="password"
            >
              Enter Your Password
            </label>
            <input
              value={authData.password}
              onChange={(e) =>
                setAuthData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full  outline-none border-none  h-full z-10"
              type={showPassword ? "text" : "password"}
              id="password"
            />
            {showPassword ? (
              <FaEye
                className="absolute right-5 top-4 text-lg"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            ) : (
              <FaEyeSlash
                className="absolute right-5 top-4 text-lg"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            )}
          </div>
          <Link className="w-full font-normal text-md" to={"/forget-password"}>
            <p >Forget Password ?</p>
          </Link>
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="bg-gray-950 text-white font-semibold px-10 py-2 rounded-xl cursor-pointer"
          >
            {loading ? <ClipLoader color="#fff" size={25} /> : "Sign In"}
          </button>
          <p>
            Don't have an Account ?{" "}
            <Link to={"/signup"}>
              <span className="cursor-pointer border-b border-black text-gray-600">
                Sign Up
              </span>
            </Link>
          </p>
        </div>
        <div className="w-[50%] drop-shadow-lg drop-shadow-black h-full text-white relative bg-black">
          <img src={logo} alt="" />
          <p className="absolute top-[58%] left-[8%] text-lg text-shadow-sm text-shadow-blue-400 font-semibold">
            Welcome to InstaVibe. Where Stories Come to Life.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
