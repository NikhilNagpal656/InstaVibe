import sendMail from "../config/Mail.js";
import { genToken } from "../config/token.js";
import { UserModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, userName, password } = req.body;

    if (!name || !email || !userName || !password) {
      return res.status(500).json({
        message: "All feilds required",
      });
    }

    if(password.lenght < 6 ){
        return res.status(500).json("password must be atleast 6 characters")
    }

    const alreadyUser = await UserModel.findOne({ email });

    if (alreadyUser) {
      return res.status(500).json({ message: "User Already Exists" });
    }


    const hashPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      userName,
      email,
      password: hashPassword,
    });


    const token = await genToken(user._id);

    res.cookie("token", token, {
      HttpOnly: true,
      maxAge: 10 * 12 * 30 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({ user});
  } catch (error) {
    return res.status(400).json({
      message: "signUp error",
      error: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(500).json({
        message: "All feilds required",
      });
    }

    const alreadyUser = await UserModel.findOne({ userName });

    

    if (!alreadyUser) {
      return res.status(500).json({ message: "User not Exists" });
    }

    const isMatch = await bcrypt.compare(password, alreadyUser.password);

    

    if (!isMatch) {
      return res.status(500).json("Incorrect Password");
    }
    const token = await genToken(alreadyUser._id);

    res.cookie("token", token, {
      HttpOnly: true,
      maxAge: 10 * 12 * 30 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({ user : alreadyUser});
  } catch (error) {
    return res.status(400).json({
      message: "signIn error",
      error: error.message,
    });
  }
};

export const signOut = async(req , res) => {
try {
    res.clearCookie("token" , {
      HttpOnly: true,
      maxAge: 10 * 12 * 30 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    })
    return res.status(200).json({message : "signout successfully"})
} catch (error) {
    return res.status(400).json({
        message : "Problem in signOut",
        error : error.message
    })
}
}

export const sendOtp = async (req ,res) => {
 try {
   const {email} = req.body

   if(!email){
    return res.status(500).json({message : "email required"})
   }

  const user = await UserModel.findOne({email})
  if(!user){
    return res.status(500).json({message : "email not found"})
  }
  const otp = Math.floor(1000 + Math.random() * 9000).toString()

  user.resetOtp = otp
  user.otpExpire = Date.now() + 5*60*1000
  user.isOtpMatch = false

  await user.save()
  await sendMail(email , otp)

  return res.status(200).json({message : "please check your mail for otp"})
 } catch (error) {
  return res.status(200).json({message : "otp sending error" , error : error.message})
 }



}

export const verifyOtp = async (req , res) => {
  try {
    const {email , otp} = req.body
  const user = await UserModel.findOne({email})

  if(!user || user.resetOtp != otp || user.otpExpire < Date.now()){
    return res.status(400).json({message : "Invalid/Expired OTP"})
  }

  user.isOtpMatch = true,
  user.otpExpire = undefined,
  user.resetOtp = undefined

  await user.save()

  return res.status(200).json({message : "otp verified successfully"})
  } catch (error) {
      return res.status(400).json({message : "otp not verified" , error : error.message})
  }
    
}

export const changePassword = async (req , res) => {
        try {
          const {email , password} = req.body
        const user = await UserModel.findOne({email})
        if(!user || !user.isOtpMatch){
          return res.status(500).json({message : "user not verified"})
        }

          const hashPassword = await bcrypt.hash(password , 10)
          user.password = hashPassword
          await user.save()
            return res.status(200).json({message : "password changed successfully"})
        } catch (error) {
                 return res.status(400).json({message : "password change error" , error : error.message})
        }
}
