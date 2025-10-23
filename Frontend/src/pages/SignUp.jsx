import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../utils/userSlice";
import { serverUrl } from "../App";

const SignUp = () => {
    const [err , setErr] = useState("")
  const [onDivClick, setOnDivClick] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authData, setAuthData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

    const [loading ,setLoading] = useState(false)
    const dispatch =  useDispatch()

  const handleSignUp = async () => {
    setErr("")
    setLoading(true)
    try {
      const res = await axios.post(`${serverUrl}/api/auth/signUp`, 
        authData,{withCredentials : true}
      );
      dispatch(setUserData(res.data.user))
      setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false)
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-amber-50">
      <div className="w-full md:w-[95%] xl:w-[65%] h-[100vh] md:h-[75%] mx-auto flex md:rounded-2xl overflow-hidden shadow-sm shadow-black/40">
        <div className="w-full md:w-[50%] h-full flex flex-col gap-5 justify-center items-center bg-white px-10 py-10">
          <h2 className="text-2xl font-semibold">
            Sign Up to{" "}
            <span className="font-semibold text-orange-500">InstaVibe</span>
          </h2>
          <div
            className="w-full border-2 border-black transition-all cursor-pointer duration-200 relative rounded-xl px-5 py-3"
            onClick={() => setOnDivClick({ ...onDivClick, name: true })}
          >
            <label
              className={`absolute cursor-pointer text-zinc-600 bg-white px-3  ${
                onDivClick.name ? "top-[-15px]" : ""
              }`}
              htmlFor="name"
            >
              Enter Your Name
            </label>
            <input
              value={authData.name}
              onChange={(e) =>
                setAuthData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full  outline-none border-none  h-full z-10"
              type="text"
              id="name"
              required
              autoComplete="true"
            />
          </div>
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
            onClick={() => setOnDivClick({ ...onDivClick, email: true })}
          >
            <label
              className={`absolute cursor-pointer text-zinc-600 bg-white px-3  ${
                onDivClick.email ? "top-[-15px]" : ""
              }`}
              htmlFor="email"
            >
              Enter Your Email
            </label>
            <input
              value={authData.email}
              onChange={(e) =>
                setAuthData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full  outline-none border-none  h-full z-10"
              type="email"
              id="email"
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
          {
            err && <p className="text-red-500 text-lg">{err}</p>
          }
          <button
            onClick={handleSignUp}
            disabled ={loading}
            className="bg-gray-950 text-white font-semibold px-10 py-2 rounded-xl cursor-pointer"
          >
           {loading ? <ClipLoader color="#fff" size={25} /> : "Sign Up"}
          </button>
          <p>
            Already have an Account ?{" "}
            <Link to={"/signin"}>
              <span className="cursor-pointer border-b border-black text-gray-600">
                Sign In
              </span>
            </Link>
          </p>
        </div>
        <div className="w-[50%] h-full hidden md:flex justify-center items-center drop-shadow-lg drop-shadow-black  text-white relative bg-black">
          <img src={logo} alt="" />
          <p className="absolute top-[58%] left-[8%] text-shadow-sm text-shadow-blue-400 md:text-sm lg:text-lg font-semibold">
            Welcome to InstaVibe. Where Stories Come to Life.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
