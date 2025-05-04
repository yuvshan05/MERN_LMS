import express from "express";
import {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    buyCourse,
    getPurchasedCourses,
    getEnrolledCourseContent
} from "../controllers/course.controller.js";
import { verifyToken, verifyTeacher } from "../middleware/auth.middleware.js"; // Middleware to check authentication & role

const courserouter = express.Router();

// ✅ Route to get all courses (Students & Teachers)
courserouter.get("/all", getCourses);

// ✅ Route to get all courses purchased by a student
courserouter.get("/purchased", verifyToken, getPurchasedCourses);

// ✅ Route to get a specific course by ID
courserouter.get("/:courseId", getCourseById);

//buy the course
courserouter.post("/buy/:courseId", verifyToken, buyCourse);

// ✅ Route to get all courses purchased by a student
courserouter.get("/purchased", verifyToken, getPurchasedCourses);


// ✅ Route to create a new course (Only Teachers)
courserouter.post("/create", verifyToken, verifyTeacher, createCourse);

// ✅ Route to update a course (Only the creator teacher)
courserouter.put("/teacher/:courseId", verifyToken, verifyTeacher, updateCourse);

// ✅ Route to delete a course (Only the creator teacher)
courserouter.delete("/teacher/delete/:courseId", verifyToken, verifyTeacher, deleteCourse);

// Get full course content for enrolled users
courserouter.get("/enrolled/:courseId", verifyToken, getEnrolledCourseContent);


export default courserouter;
