import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

export const cloudinaryConfig = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    console.log("cloundnary connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export const uploadImage = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image , {resource_type : 'auto' , folder : "InstaVibe"})
    fs.unlinkSync(image)
    return result.secure_url
  } catch (error) {
    fs.unlinkSync(image)
    console.log(error);
    
  }
};
