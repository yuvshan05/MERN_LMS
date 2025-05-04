import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "dzspkf3x9",
  api_key: "796577133715568",
  api_secret: "eFAU4RAUqhxhSBnT5QVAbuhx2-0",
});

// Storage settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "course_videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi"],
  },
});

// Multer middleware
const uploadVideo = multer({ storage });

export { cloudinary, uploadVideo };
