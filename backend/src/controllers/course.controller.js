import Course from "../models/course.model.js"; // Import the Course model
import { errorHandler } from "../utils/error.js"; // Handle errors
import mongoose from "mongoose"; // Ensure valid ObjectId checking
import { uploadVideo } from "../utils/cloudinary.js";
import User from "../models/user.model.js";

// ✅ Create a new course (Only Teachers)
export const createCourse = async (req, res, next) => {
    try {
        console.log("User:", req.user);
        console.log("Request body:", req.body);

        const { title, description, price, imageUrl, lessons } = req.body;

        if (!req.user) {
            return next(errorHandler(401, "Authentication required"));
        }

        if (req.user.role !== "teacher") {
            return next(errorHandler(403, "Only teachers can create courses"));
        }

        const newCourse = new Course({
            title,
            description,
            price,
            imageUrl,
            lessons,
            teacher: req.user._id,
        });

        console.log("Course to be saved:", newCourse);

        await newCourse.save();
        res.status(201).json({ message: "Course created successfully!", course: newCourse });
    } catch (error) {
        console.error("🚨 Course creation error:", error.message);
        console.error("Stack trace:", error.stack);
        next(errorHandler(500, `Failed to create course: ${error.message}`));
    }
};

//buy course
export const buyCourse = async (req, res, next) => {
    try {
      const userId = req.user._id; // from JWT
      const courseId = req.params.courseId;
  
      const user = await User.findById(userId);
      const course = await Course.findById(courseId);
  
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }
      if (!course) {
        return next(errorHandler(404, "Course not found"));
      }
  
      if (user.purchasedCourses.includes(courseId)) {
        return next(errorHandler(400, "You have already purchased this course"));
      }
  
      user.purchasedCourses.push(courseId);
      await user.save();
  
      res.status(200).json({ 
        message: "Course purchased successfully!", 
        purchasedCourses: user.purchasedCourses 
      });
      
    } catch (error) {
      console.error(error); // <-- ADD THIS LINE to see the actual error
      next(errorHandler(500, error.message)); // <-- CHANGE this to send real error
    }
  };
  

// ✅ Get all courses (For Students & Teachers)
export const getCourses = async (req, res, next) => {
    try {
        // Fetch all courses and populate the teacher field with name and email
        const courses = await Course.find().populate("teacher", "name email");
        
        // Map through courses to structure the response
        const formattedCourses = courses.map(course => {
            return {
                _id: course._id,
                title: course.title,
                description: course.description,
                price: course.price,
                imageUrl: course.imageUrl, // Include imageUrl for thumbnail
                teacher: course.teacher,
                lessonCount: course.lessons.length, // Add lesson count as additional info
                createdAt: course.createdAt,
                updatedAt: course.updatedAt
            };
        });
        
        res.status(200).json(formattedCourses);
    } catch (error) {
        next(errorHandler(500, "Failed to fetch courses"));
    }
};

// ✅ Get a specific course by ID
export const getCourseById = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(errorHandler(400, "Invalid course ID"));
        }

        const course = await Course.findById(courseId).populate("teacher", "name email");
        if (!course) {
            return next(errorHandler(404, "Course not found"));
        }

        res.status(200).json(course);
    } catch (error) {
        next(errorHandler(500, "Failed to fetch course details"));
    }
};

//view all purchased courses of a student

export const getPurchasedCourses = async (req, res, next) => {
    try {
      const userId = req.user.id; // ✅ we get it from token
  
      // validate user id
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(errorHandler(400, "Invalid user ID"));
      }
  
      // find the user and populate purchasedCourses
      const user = await User.findById(userId).populate("purchasedCourses");
  
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }
  
      res.status(200).json(user.purchasedCourses);
  
    } catch (error) {
      console.error(error);
      next(errorHandler(500, "Failed to fetch purchased courses"));
    }
  };

// ✅ Update course details (Only the creator teacher can update)
export const updateCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(errorHandler(400, "Invalid course ID"));
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return next(errorHandler(404, "Course not found"));
        }

        // Ensure only the course creator (teacher) can update it
        if (course.teacher.toString() !== req.user._id.toString()) {
            return next(errorHandler(403, "You are not authorized to update this course"));
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
        res.status(200).json({ message: "Course updated successfully!", course: updatedCourse });
    } catch (error) {
        next(errorHandler(500, "Failed to update course"));
    }
};

// ✅ Delete a course (Only the creator teacher can delete)
export const deleteCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(errorHandler(400, "Invalid course ID"));
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return next(errorHandler(404, "Course not found"));
        }

        // Ensure only the creator teacher can delete
        if (course.teacher.toString() !== req.user._id.toString()) {
            return next(errorHandler(403, "You are not authorized to delete this course"));
        }

        await course.deleteOne();
        res.status(200).json({ message: "Course deleted successfully!" });
    } catch (error) {
        next(errorHandler(500, "Failed to delete course"));
    }
};

// Get full course content (only for enrolled/purchased users)
export const getEnrolledCourseContent = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;

        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(errorHandler(400, "Invalid course ID"));
        }

        // Find user and check if course is purchased
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // Check if the course is in user's purchasedCourses
        const hasPurchased = user.purchasedCourses.some(
            (id) => id.toString() === courseId
        );
        if (!hasPurchased) {
            return next(errorHandler(403, "You have not enrolled in this course"));
        }

        // Fetch the course with full lesson content
        const course = await Course.findById(courseId).populate("teacher", "name email");
        if (!course) {
            return next(errorHandler(404, "Course not found"));
        }

        // Structure the response
        const courseContent = {
            _id: course._id,
            title: course.title,
            description: course.description,
            price: course.price,
            imageUrl: course.imageUrl,
            teacher: course.teacher,
            lessons: course.lessons, // full lessons array with videoUrl
            createdAt: course.createdAt,
            updatedAt: course.updatedAt
        };

        res.status(200).json(courseContent);

    } catch (error) {
        next(errorHandler(500, "Failed to fetch enrolled course content"));
    }
};

