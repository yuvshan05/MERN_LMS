import React, { useEffect, useState, useRef } from "react";
import { useParams , useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {toast} from "react-hot-toast";

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const overviewRef = useRef(null);
  const contentRef = useRef(null);
  const instructorRef = useRef(null);
  const reviewsRef = useRef(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:7000/api/course/${courseId}`);
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Failed to load course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        // This endpoint would need to be created in your backend
        const res = await fetch(`http://localhost:7000/api/course/purchased`, {
          credentials: 'include',
        });
        const data = await res.json();
        // If data is an array of course objects:
        if (Array.isArray(data) && data.some(c => c._id === courseId || c === courseId)) {
          setIsPurchased(true);
        } else {
          setIsPurchased(false);
        }
        
      } catch (err) {
        console.error("Failed to check purchase status:", err);
      }
    };
  
    checkPurchaseStatus();
  }, [courseId]);
  
  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const res = await fetch(`http://localhost:7000/api/course/buy/${courseId}`, {
        method: 'POST',
        credentials: 'include', // to include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Update purchase status
      setIsPurchased(true);
      toast.success(data.message || 'Course purchased successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to purchase course');
      console.error("Failed to purchase course:", err);
    } finally {
      setPurchasing(false);
    }
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const ref = {
      overview: overviewRef,
      content: contentRef,
      instructor: instructorRef,
      reviews: reviewsRef,
    }[section];

    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-10 text-center"
        >
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl font-medium text-indigo-800">Loading your learning journey...</p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100"
      >
        <div className="p-10 text-center">
          <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Course Not Found</h2>
          <p className="text-gray-600">We couldn't locate the course you're looking for.</p>
        </div>
      </motion.div>
    );
  }

  // Prepare content sections
  const contentSections = [
    { title: "Introduction to the Course", duration: "15 min", locked: false },
    { title: "Core Concepts", duration: "45 min", locked: false },
    { title: "Practical Applications", duration: "30 min", locked: true },
    { title: "Advanced Techniques", duration: "60 min", locked: true },
    { title: "Case Studies", duration: "50 min", locked: true },
    { title: "Final Project", duration: "120 min", locked: true },
  ];

  // Sample reviews
  const reviews = [
    { name: "Alex Johnson", rating: 5, comment: "This course exceeded my expectations! The instructor explains complex concepts in an easy-to-understand way." },
    { name: "Sarah Williams", rating: 4, comment: "Great content and well-structured. I would recommend this to anyone starting in this field." },
  ];

  // Animation variants
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-screen">
      {/* Sticky Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">LMS</span>
              </div>
              <span className="font-semibold text-gray-800 text-lg hidden md:inline-block">Learning Journey</span>
            </motion.div>
            
            <div className="flex space-x-1 md:space-x-4 overflow-x-auto scrollbar-hide py-2">
              {["overview", "content", "instructor", "reviews"].map((section) => (
                <motion.button
                  key={section}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(section)}
                  className={`px-3 py-2 rounded-full whitespace-nowrap ${
                    activeSection === section
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-indigo-100"
                  } transition-all duration-300 text-sm md:text-base`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        ref={overviewRef}
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="pt-10 pb-20 px-4 md:px-10 lg:px-20 bg-gradient-to-r from-indigo-600 to-blue-700 text-white relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white opacity-5 animate-ping animation-delay-2000"></div>
          <div className="absolute top-40 right-20 w-20 h-20 rounded-full bg-indigo-300 opacity-20 animate-pulse animation-delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <motion.div 
              className="flex-1"
              variants={fadeInUp}
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                variants={fadeInUp}
              >
                {course.title}
              </motion.h1>
              
              <motion.p 
                className="text-lg text-indigo-100 mb-6"
                variants={fadeInUp}
              >
                {course.description}
              </motion.p>
              
              <motion.div 
                className="flex items-center mb-6"
                variants={fadeInUp}
              >
                <div className="flex mr-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-indigo-100">
                  4.9 (180 reviews)
                </span>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap items-center gap-4 mb-8"
                variants={fadeInUp}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>10 hours of content</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Certificate included</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <span>Lifetime access</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={fadeInUp}
              >
                {/* Replace the existing Enroll Now button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isPurchased ? () => navigate(`/course/learn/${courseId}`) : handlePurchase}
              disabled={purchasing}
              className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-opacity-90 transition-all shadow-lg relative"
            >
              {purchasing ? (
                <>
                  <span className="opacity-0">Processing</span>
                  <svg className="animate-spin h-5 w-5 text-indigo-600 absolute inset-0 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : isPurchased ? (
                "View Course"
              ) : (
                `Enroll Now - ${course.price ? `₹${course.price.toFixed(2)}` : "Free"}`
              )}
            </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  Preview Course
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="lg:w-2/5"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-blue-400 rounded-2xl transform rotate-6 scale-105 opacity-50 blur-xl"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={course.imageUrl || "https://via.placeholder.com/600x400?text=Course+Preview"}
                    alt={course.title}
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                    >
                      <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* What You'll Learn Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-4 py-16"
      >
        <motion.h2 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
        >
          What You'll Learn
        </motion.h2>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(course.outcomes || [
            "Master core principles and techniques",
            "Build real-world projects for your portfolio",
            "Develop problem-solving skills",
            "Learn industry best practices",
            "Get personalized feedback",
            "Join a community of learners"
          ]).map((point, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-4">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700">{point}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Course Content Section */}
      <motion.div 
        ref={contentRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16 px-4"
      >
        <div className="container mx-auto">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            Course Content
          </motion.h2>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            {contentSections.map((section, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="mb-4"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${section.locked ? "bg-gray-200" : "bg-indigo-100"}`}>
                        {section.locked ? (
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{section.title}</h3>
                        <p className="text-sm text-gray-500">{section.duration}</p>
                      </div>
                    </div>
                    <div>
                      {section.locked ? (
                        <span className="text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full">Locked</span>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Show All Sections
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Instructor Section */}
      <motion.div 
        ref={instructorRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16"
      >
        <motion.h2 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-800 mb-12 text-center"
        >
          Meet Your Instructor
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
          >
            <div className="md:w-1/3 bg-gradient-to-br from-indigo-500 to-blue-600 p-6 text-white">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden mb-4">
                  <img 
                    src="https://via.placeholder.com/200x200?text=Instructor" 
                    alt={course.teacher?.name || "Instructor"} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{course.teacher?.name || "John Doe"}</h3>
                <p className="text-indigo-100 text-sm mb-4">Expert Instructor</p>
                
                <div className="flex space-x-3">
                  <motion.a whileHover={{ y: -3 }} href="#" className="text-white hover:text-indigo-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </motion.a>
                  <motion.a whileHover={{ y: -3 }} href="#" className="text-white hover:text-indigo-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </motion.a>
                  <motion.a whileHover={{ y: -3 }} href="#" className="text-white hover:text-indigo-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-gray-50 px-4 py-2 rounded-lg flex flex-col items-center">
                  <span className="text-2xl font-bold text-indigo-600">12+</span>
                  <span className="text-sm text-gray-500">Courses</span>
                </div>
                
                <div className="bg-gray-50 px-4 py-2 rounded-lg flex flex-col items-center">
                  <span className="text-2xl font-bold text-indigo-600">10k+</span>
                  <span className="text-sm text-gray-500">Students</span>
                </div>
                
                <div className="bg-gray-50 px-4 py-2 rounded-lg flex flex-col items-center">
                  <span className="text-2xl font-bold text-indigo-600">4.9</span>
                  <span className="text-sm text-gray-500">Rating</span>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-3">About Me</h4>
              <p className="text-gray-600 mb-4">
                {course.teacher?.bio || 
                  "I'm a passionate instructor with over 8 years of industry experience. I believe in practical, hands-on learning that prepares you for real-world challenges. My teaching approach focuses on building strong fundamentals while exploring advanced concepts through projects and case studies."}
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-3">About Me</h4>
              <p className="text-gray-600 mb-4">
                {course.teacher?.bio || 
                  "I'm a passionate instructor with over 8 years of industry experience. I believe in practical, hands-on learning that prepares you for real-world challenges. My teaching approach focuses on building strong fundamentals while exploring advanced concepts through projects and case studies."}
              </p>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-3">My Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {["Web Development", "Frontend Design", "Backend Systems", "UX/UI"].map((skill) => (
                  <span key={skill} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div 
        ref={reviewsRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-indigo-50 py-16 px-4"
      >
        <div className="container mx-auto">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-12 text-center"
          >
            Student Reviews
          </motion.h2>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                    <span className="font-bold text-indigo-600">{review.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">{review.comment}</p>
              </motion.div>
            ))}
            
            {/* Add a special review card */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-xl shadow-lg text-white"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4">
                  <span className="font-bold text-indigo-600">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className="w-4 h-4 text-yellow-400" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-indigo-100 italic">"This course completely transformed my understanding of the subject. The projects were challenging but incredibly rewarding. I landed a job within a month of completing this course!"</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors shadow-md border border-indigo-100"
            >
              See All Reviews
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16"
      >
        <motion.h2 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-800 mb-12 text-center"
        >
          Frequently Asked Questions
        </motion.h2>
        
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {[
            {
              question: "How long do I have access to the course?",
              answer: "You will have lifetime access to this course, including all future updates and additional content."
            },
            {
              question: "Is there a certificate upon completion?",
              answer: "Yes, you'll receive a certificate of completion once you finish all modules of the course."
            },
            {
              question: "What if I'm not satisfied with the course?",
              answer: "We offer a 30-day money-back guarantee if you're not completely satisfied with the course."
            },
            {
              question: "Do I need any prior knowledge?",
              answer: "This course is designed for all skill levels. While some basic understanding of the subject may be helpful, it's not required."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="mb-6"
            >
              <details className="group bg-white rounded-lg shadow-md cursor-pointer">
                <summary className="list-none flex items-center justify-between p-5 font-medium text-gray-800">
                  <span>{faq.question}</span>
                  <svg className="w-5 h-5 text-indigo-600 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-5 pt-0 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              </details>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-indigo-600 to-blue-700 py-16 px-4 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-500 opacity-20 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500 opacity-10 -ml-48 -mb-48"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Ready to Start Your Learning Journey?
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-indigo-100 mb-8 text-lg"
            >
              Join thousands of students who have already transformed their skills and careers with this course.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              {/* Find the Enroll Now button in the Call to Action section and replace it */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPurchased ? () => navigate(`/course/learn/${courseId}`) : handlePurchase}
            disabled={purchasing}
            className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-opacity-95 transition-colors shadow-xl relative"
          >
            {purchasing ? (
              <>
                <span className="opacity-0">Processing</span>
                <svg className="animate-spin h-5 w-5 text-indigo-600 absolute inset-0 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : isPurchased ? (
              "Continue Learning"
            ) : (
              "Enroll Now"
            )}
          </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                Download Syllabus
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">LMS</span>
                </div>
                <span className="font-semibold text-white text-lg">Learning Journey</span>
              </div>
              <p className="text-gray-400 mt-2">Empowering learners worldwide</p>
            </div>
            
            <div className="flex space-x-6">
              <motion.a whileHover={{ y: -3 }} href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              <motion.a whileHover={{ y: -3 }} href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.8 2h8.4c1.4 0 2.4.1 3.3.4.9.3 1.6.7 2.2 1.3.6.6 1 1.4 1.3 2.2.3.9.4 1.9.4 3.3v8.4c0 1.4-.1 2.4-.4 3.3-.3.9-.7 1.6-1.3 2.2-.6.6-1.4 1-2.2 1.3-.9.3-1.9.4-3.3.4h-8.4c-1.4 0-2.4-.1-3.3-.4-.9-.3-1.6-.7-2.2-1.3-.6-.6-1-1.4-1.3-2.2-.3-.9-.4-1.9-.4-3.3v-8.4c0-1.4.1-2.4.4-3.3.3-.9.7-1.6 1.3-2.2.6-.6 1.4-1 2.2-1.3.9-.3 1.9-.4 3.3-.4zm0 2c-1.3 0-2.1.1-2.8.3-.7.2-1.2.5-1.6.9-.4.4-.7.9-.9 1.6-.2.7-.3 1.5-.3 2.8v8.4c0 1.3.1 2.1.3 2.8.2.7.5 1.2.9 1.6.4.4.9.7 1.6.9.7.2 1.5.3 2.8.3h8.4c1.3 0 2.1-.1 2.8-.3.7-.2 1.2-.5 1.6-.9.4-.4.7-.9.9-1.6.2-.7.3-1.5.3-2.8v-8.4c0-1.3-.1-2.1-.3-2.8-.2-.7-.5-1.2-.9-1.6-.4-.4-.9-.7-1.6-.9-.7-.2-1.5-.3-2.8-.3h-8.4zm6.2 3.2c2.1 0 2.4 0 3.2.1.8 0 1.2.2 1.5.3.4.1.6.3.9.6.3.3.5.5.6.9.1.3.2.7.3 1.5 0 .8.1 1.1.1 3.2s0 2.4-.1 3.2c0 .8-.2 1.2-.3 1.5-.1.4-.3.6-.6.9-.3.3-.5.5-.9.6-.3.1-.7.2-1.5.3-.8 0-1.1.1-3.2.1s-2.4 0-3.2-.1c-.8 0-1.2-.2-1.5-.3-.4-.1-.6-.3-.9-.6-.3-.3-.5-.5-.6-.9-.1-.3-.2-.7-.3-1.5 0-.8-.1-1.1-.1-3.2s0-2.4.1-3.2c0-.8.2-1.2.3-1.5.1-.4.3-.6.6-.9.3-.3.5-.5.9-.6.3-.1.7-.2 1.5-.3.8 0 1.1-.1 3.2-.1zm0-2c-2.2 0-2.5 0-3.3.1-.9 0-1.5.2-2 .4-.5.2-1 .5-1.4 1-.5.4-.8.9-1 1.4-.2.5-.4 1.1-.4 2 0 .8-.1 1.1-.1 3.3s0 2.5.1 3.3c0 .9.2 1.5.4 2 .2.5.5 1 1 1.4.5.5 1 .8 1.4 1 .5.2 1.1.4 2 .4.8 0 1.1.1 3.3.1s2.5 0 3.3-.1c.9 0 1.5-.2 2-.4.5-.2 1-.5 1.4-1 .5-.5.8-1 1-1.4.2-.5.4-1.1.4-2 0-.8.1-1.1.1-3.3s0-2.5-.1-3.3c0-.9-.2-1.5-.4-2-.2-.5-.5-1-1-1.4-.5-.5-1-.8-1.4-1-.5-.2-1.1-.4-2-.4-.8 0-1.1-.1-3.3-.1zm0 5.4c-2.4 0-4.3 1.9-4.3 4.3s1.9 4.3 4.3 4.3 4.3-1.9 4.3-4.3-1.9-4.3-4.3-4.3zm0 7.1c-1.5 0-2.8-1.2-2.8-2.8s1.2-2.8 2.8-2.8 2.8 1.2 2.8 2.8-1.3 2.8-2.8 2.8z"/>
                </svg>
              </motion.a>
            </div>
          </div>
          
          <hr className="border-gray-800 my-8" />
          
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Learning Journey. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CoursePage;