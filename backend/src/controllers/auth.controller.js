const cloudinary = require('../config/cloudinary');
const { generateToken } = require('../config/utils')
const userField = require('../models/user.model')
const bcrypt = require('bcryptjs')
require('../config/utils')


exports.signup = async (req, res) => {
    // console.log(req.body)
    const { email, fullName, password, profilePic } = req.body

    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" })
        }


        const user = await userField.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already exists" })


        // hash password (Eg => 1235455 : nsanskamsJam_sNS451521aSA3)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userField({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            // generate jwt token here
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

        } else {
            res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}




exports.login = async (req, res) => {
    const { email, password } = req.body


    try {
        const user = await userField.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "invalid email or password" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "invalid email or password" })
        }

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            password: user.password,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}




exports.logout = (req, res) => {

    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logout Successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}




exports.updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        // Ensure profilePic is a Base64 string
        if (!profilePic.startsWith("data:image")) {
            return res.status(400).json({ message: "Invalid image format" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pics",
        });

        const updatedUser = await userField.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}




exports.checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller", error.message)
        res.status(500).json({ message: "internal server error" })
    }
}


