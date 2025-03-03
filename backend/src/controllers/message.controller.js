const userField = require('../models/user.model')
const messageField = require('../models/message.model')
const cloudinary = require('../config/cloudinary');
const { getRecieverSocketId, io } = require('../config/socket')





exports.getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await userField.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).json(filteredUsers)

    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}




exports.getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await messageField.find({
            $or: [
                { senderId: myId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: myId }
            ]
        })

        res.status(200).json(messages)

    } catch (error) {
        console.log("Error in getMessages controller", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}




exports.sendMessages = async (req, res) => {
    try {
        //   console.log("Received request body:", req.body);   // Debugging step

        const { text, image } = req.body
        const { id: recieverId } = req.params
        const senderId = req.user._id


        if (!text && !image) {
            return res.status(400).json({ error: "Message must contain text or an image" });
        }


        let imageUrl = ""
        if (image) {
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new messageField({
            senderId,
            recieverId,
            text,
            image: imageUrl
        })


        await newMessage.save()


        const recieverSocketId = getRecieverSocketId(recieverId)
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }


        res.status(201).json(newMessage)


    } catch (error) {
        console.log("Error in sendMessage controller", error.message)
        res.status(500).json({ error: "Internal server error " })
    }
}




