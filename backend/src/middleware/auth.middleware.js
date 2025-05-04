import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token; // Assuming token is stored in cookies

        if (!token) {
            return next(errorHandler(401, "Access denied! No token provided."));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // Attach user to request

        if (!req.user) {
            return next(errorHandler(401, "User not found!"));
        }

        next();
    } catch (error) {
        next(errorHandler(401, "Invalid token"));
    }
};

export const verifyTeacher = (req, res, next) => {
    if (req.user.role === "student") {
        return next(errorHandler(403, "Access denied! Only teachers can perform this action."));
    }
    next();
};
