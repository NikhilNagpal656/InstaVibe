import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { FaLongArrowAltLeft } from "react-icons/fa";
import { serverUrl } from "../App";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate()
  const [onDivClick, setOnDivClick] = useState({
    email: false,
    otp: false,
    password: false,
    newPassword: false,
  });
  const [email , setEmail] = useState("")
  const [otp , setOtp] = useState("")
  const [newPassword , setNewPassword] = useState("")
  const [confirmPassword , setConfirmPassword] = useState("")
  const [loading , setLoading] = useState(false)

  const sendOtp = async () => {
    setLoading(true)
    try {
      
      let res = await axios.post(`${serverUrl}/api/auth/sendotp` , {email} , {withCredentials : true})
      console.log(res.data);
      
      setStep(2)
      setLoading(false)
    } catch (error) {
      console.log(error);
         setLoading(false)
      
    }
  }
  const verifyOtp = async () => {
    setLoading(true)
    try {
      
      let res = await axios.post(`${serverUrl}/api/auth/verifyotp` , {email , otp} , {withCredentials : true})
      console.log(res.data);
      
      setStep(3)
      setLoading(false)
    } catch (error) {
      console.log(error);
         setLoading(false)
      
    }
  }

  const changePassword = async () => {
    if(confirmPassword != newPassword){
      return alert("both are not same")
    }
    setLoading(true)
    try {
      
      let res = await axios.post(`${serverUrl}/api/auth/changePassword` , {email , password : newPassword} , {withCredentials : true})
      console.log(res.data);
      
      navigate("/signin")
      setLoading(false)
    } catch (error) {
      console.log(error);
         setLoading(false)
      
    }
  }
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-800">
      <div className="w-[30%] h-[50%] mx-auto flex rounded-2xl justify-center items-center bg-white overflow-hidden shadow-sm shadow-black/40">
        {step === 1 && (
          <div className="flex flex-col gap-10 w-full items-center px-5">
            <div className="flex gap-30 items-center w-full">
            <FaLongArrowAltLeft onClick={()=>navigate("/signin")} className="text-red-500 cursor-pointer text-2xl" />
            <h2 className="font-semibold text-xl text-center">Forget Password</h2>
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
                Enter Your email
              </label>
              <input
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                className="w-full  outline-none border-none  h-full z-10"
                type="text"
                id="email"
                required
              />
            </div>
            <button
            onClick={sendOtp}
              disabled={loading || email.length === 0}
              className="bg-gray-950 text-white font-semibold px-10 py-2 rounded-xl cursor-pointer"
            >
              {loading ? <ClipLoader color="#fff" size={25} /> : "Send OTP"}
            </button>
          </div>
        )}
        {
            step === 2 && 
             <div className="flex flex-col gap-10 w-full items-center px-5">
            <h2 className="font-semibold text-xl">Enter Your OTP</h2>
            <div
              className="w-full border-2 border-black transition-all cursor-pointer duration-200 relative rounded-xl px-5 py-3"
              onClick={() => setOnDivClick({ ...onDivClick, otp: true })}
            >
              <label
                className={`absolute cursor-pointer text-zinc-600 bg-white px-3  ${
                  onDivClick.otp ? "top-[-15px]" : ""
                }`}
                htmlFor="otp"
              >
                Enter OTP
              </label>
              <input
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                className="w-full  outline-none border-none  h-full z-10"
                type="text"
                id="otp"
                required
              />
            </div>
            <button
            onClick={verifyOtp}
              disabled={loading}
              className="bg-gray-950 text-white font-semibold px-10 py-2 rounded-xl cursor-pointer"
            >
              {loading ? <ClipLoader color="#fff" size={25} /> : "Verify OTP"}
            </button>
          </div>
        }
        {
            step === 3 && 
            <div className="flex flex-col gap-10 w-full items-center px-5">
            <h2 className="font-semibold text-xl">Create New Password</h2>
            
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
                Enter Paswword
              </label>
              <input
                 value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                className="w-full  outline-none border-none  h-full z-10"
                type="password"
                id="password"
                required
              />
            </div>
            <div
              className="w-full border-2 border-black transition-all cursor-pointer duration-200 relative rounded-xl px-5 py-3"
              onClick={() => setOnDivClick({ ...onDivClick, newPassword: true })}
            >
              <label
                className={`absolute cursor-pointer text-zinc-600 bg-white px-3  ${
                  onDivClick.newPassword ? "top-[-15px]" : ""
                }`}
                htmlFor="newPassword"
              >
                Confirm Password
              </label>
              <input
                 value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                className="w-full  outline-none border-none  h-full z-10"
                type="text"
                id="newPassword"
                required
              />
            </div>
            <button
            onClick={changePassword}
              disabled={loading}
              className="bg-gray-950 text-white font-semibold px-10 py-2 rounded-xl cursor-pointer"
            >
              {loading ? <ClipLoader color="#fff" size={25} /> : "Reset Password"}
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default ForgetPassword;
