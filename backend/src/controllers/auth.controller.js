import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js"
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists."}) 
        }

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"})  
        }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be atleast 6 characters!"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid Email Format"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        await newUser.save();

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic 
            });

            // send welcome email to the new user
            try {
                await sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL);
            } catch (error) {
                console.log("Failed to send welcome email", error);
            }
        }else{
            res.status(400).json({message:"Invalid user data"}) 
        }

    } catch (error) {
        console.log("Error in signup controller", error)
        res.status(500).json({message:"Internal Server Error"})
    }
};

export const login = async (req, res) => {
    const {email,password} = req.body;
};

export const logout = async (req, res) => {
  res.send("Logout Endpoint");
};
