import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import { toast } from "react-hot-toast";

const CourseLearnPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}/api/course/enrolled/${courseId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not enrolled or course not found");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        toast.error("Access denied or course not found");
        navigate(`/course/${courseId}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium text-indigo-800">Loading course...</p>
        </motion.div>
      </div>
    );
  }

  if (!course) return null;

  const lessons = course.lessons || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex">
      {/* Sidebar with lessons */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
        className="w-80 bg-white shadow-xl p-6 flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Course Content</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {lessons.map((lesson, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03, backgroundColor: "#eef2ff" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveLesson(idx)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                idx === activeLesson ? "bg-indigo-100 font-semibold text-indigo-700" : "bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-indigo-500 font-bold">{idx + 1}.</span>
                <span>{lesson.title}</span>
              </div>
              <div className="text-xs text-gray-400">{lesson.duration}</div>
            </motion.button>
          ))}
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLesson}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl"
          >
            <h1 className="text-3xl font-bold text-indigo-800 mb-4">{lessons[activeLesson]?.title}</h1>
            <div className="rounded-xl overflow-hidden shadow-lg mb-6 bg-black">
              <ReactPlayer
                url={lessons[activeLesson]?.videoUrl}
                controls
                width="100%"
                height="400px"
                playing
                style={{ borderRadius: "12px" }}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow"
            >
              <p className="text-gray-800 text-lg">{lessons[activeLesson]?.content}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CourseLearnPage;
