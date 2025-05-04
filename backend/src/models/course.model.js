import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  teacher: {  // Changed from "instructor" to "teacher"
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessons: [
    {
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      duration: {  // This is required
        type: String,
        required: true
      },
      videoUrl: {  // This is required
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);
export default Course;