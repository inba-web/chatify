import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "cloudinary";
import { getReceiverSocketId } from "../lib/socket.js";
import {io} from "../lib/socket.js"

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getAllContact controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    console.error("Error in the getMessagesByUserId Controller :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if(!text && !image){
        return res.status(400).json({error:"Text or image is required"})
    }

    if(senderId.equals(receiverId)){
        return res.status(400).json({error:"You cannot send message to yourself"})
    }

    const recieverExists = await User.findById({_id:receiverId});
    if(!recieverExists){
        return res.status(400).json({error:"User does not exist"});
    }

    let imageurl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageurl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageurl,
    });

    await newMessage.save();
    res.status(201).json(newMessage);

    // todo : send message in real-time if user is online - socket.io
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }
  } catch (error) {
    console.error("Error in the sendMessage Controller :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // find all the messages where the logged-in user is either sender or reciever
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString() 
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )   
      ),
    ];

    const chatPartners = await User.find({_id:{$in:chatPartnerIds}}).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners :",error);
    res.status(500).json({ error: "Internal Server Error" })
  }
};