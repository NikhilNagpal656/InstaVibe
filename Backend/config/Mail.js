import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (to , otp) => {
     await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset Your Password",
    html: `<p>Your Otp for Password Reset is <b>${otp}</b>. It expires in 5 minutes</p>`
  });

}

export default sendMail