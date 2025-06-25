import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Validate request body
    if (!name || !email || !password || !role) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, 'Email already in use'));
        }

        // Validate role
        if (!["student", "teacher"].includes(role)) {
            return next(errorHandler(400, 'Invalid role. Allowed roles: student, teacher'));
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password, // Password will be hashed by pre-save middleware
            role,
        });

        await newUser.save();

        // Generate JWT token using jwt.sign instead of model method
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Set token in cookie - using access_token for consistency
        res.cookie("access_token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // prevent XSS attacks
            sameSite: "none", // prevent CSRF attacks
            secure: true,
        });

        res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                profilePicture: newUser.profilePicture
            }
        });

    } catch (error) {
        console.log("Error in signup controller", error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        // Find user by email
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }

        // Check if password is correct
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Incorrect Password'));
        }

        // Generate JWT Token with expiration time
        const token = jwt.sign(
            { id: validUser._id, role: validUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        // Exclude password from response
        const { password: pass, ...userData } = validUser._doc;

        res.status(200)
            .cookie('access_token', token, {
                httpOnly: true,
                secure: true, // Only secure in production
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days - adding this for consistency
            })
            .json({
                message: "Signin successful",
                token,
                user: userData
            });

    } catch (error) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};

export const signout = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return next(errorHandler(401, "Unauthorized! Please sign in first."));
        }

        const userId = req.user._id;
        console.log(`🔹 Signing out user: ${userId}`);

        // ✅ Find the user
        const user = await User.findById(userId);
        if (!user) {
            console.log("❌ User not found!");
            return next(errorHandler(404, "User not found!"));
        }

        console.log(`✅ Found user: ${user.email}`);

        // ✅ Clear authentication cookie and send response
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        .status(200)
        .json({ message: "Signout successful!" });

        console.log("✅ User signed out successfully!");

    } catch (error) {
        console.error("🚨 Error signing out:", error);
        next(errorHandler(500, "Internal Server Error"));
    }
};
