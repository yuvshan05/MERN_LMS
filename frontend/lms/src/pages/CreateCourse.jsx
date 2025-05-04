import React, { useState, useEffect } from "react";

const CourseCreationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    lessons: [{ title: "", content: "", duration: "", videoUrl: "" }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [activeSection, setActiveSection] = useState("basic");
  const [animatePulse, setAnimatePulse] = useState(false);

  useEffect(() => {
    // Initial entrance animation
    const timer = setTimeout(() => {
      setAnimatePulse(true);
      setTimeout(() => setAnimatePulse(false), 1000);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedLessons = [...formData.lessons];
      updatedLessons[index][name] = value;
      setFormData({ ...formData, lessons: updatedLessons });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addLesson = () => {
    setFormData({
      ...formData,
      lessons: [...formData.lessons, { title: "", content: "", duration: "", videoUrl: "" }],
    });
    // Scroll to bottom after adding lesson
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const removeLesson = (index) => {
    if (formData.lessons.length > 1) {
      const updatedLessons = formData.lessons.filter((_, i) => i !== index);
      setFormData({ ...formData, lessons: updatedLessons });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Animated validation effect
    setAnimatePulse(true);
    setTimeout(() => setAnimatePulse(false), 800);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulated delay for animation
      
      const response = await fetch("http://localhost:7000/api/course/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      setMessage({ text: data.message || "Course created successfully!", type: "success" });
    } catch (err) {
      setMessage({ text: "Error: " + (err.message || "Something went wrong"), type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4" style={{
      background: "linear-gradient(135deg, #f5f7ff 0%, #eef1f5 100%)",
    }}>
      <div 
        className={`max-w-4xl mx-auto overflow-hidden transform transition-all duration-700 ${animatePulse ? 'scale-102' : 'scale-100'}`}
        style={{
          perspective: "1000px",
        }}
      >
        <div className={`relative bg-white rounded-2xl shadow-2xl transition-all duration-700 ease-in-out ${animatePulse ? 'shadow-indigo-100' : ''}`} 
          style={{
            transformStyle: "preserve-3d",
            animation: "cardFloat 6s ease-in-out infinite",
          }}
        >
          {/* Floating bubbles background effect */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-indigo-50 opacity-50"
                style={{
                  width: `${Math.random() * 120 + 50}px`,
                  height: `${Math.random() * 120 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `bubble ${Math.random() * 15 + 15}s ease-in-out infinite alternate`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
          
          {/* Glowing header border */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{
            background: "linear-gradient(to right, #6366f1, #8b5cf6, #6366f1)",
            animation: "borderGlow 4s infinite alternate",
          }}></div>
          
          <div className="relative p-8 z-10">
            <div className="flex items-center justify-center mb-8">
              <div className="relative overflow-hidden">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text relative z-10 transition-all duration-500 hover:tracking-wider" style={{
                  backgroundImage: "linear-gradient(to right, #4f46e5, #8b5cf6)",
                  WebkitBackgroundClip: "text"
                }}>
                  Create New Course
                </h1>
                <div className="absolute -bottom-2 left-0 h-3 bg-indigo-100 w-full transform transition-all duration-700 hover:scale-x-110" style={{
                  animation: "pulse 2s infinite",
                }}></div>
              </div>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl text-white text-center animate-fadeIn ${message.type === "success" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-rose-500 to-pink-500"}`}>
                <div className="flex items-center justify-center gap-2">
                  <span className={`inline-block ${message.type === "success" ? "animate-bounce" : "animate-spin"}`}>
                    {message.type === "success" ? "✅" : "⚠️"}
                  </span>
                  {message.text}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Navigation tabs */}
              <div className="flex mb-8 bg-indigo-50 rounded-xl p-1">
                <button 
                  type="button" 
                  onClick={() => setActiveSection("basic")}
                  className={`flex-1 py-2 rounded-lg text-center transition-all duration-300 ${activeSection === "basic" ? "bg-white text-indigo-600 shadow-md" : "text-indigo-500 hover:bg-indigo-100"}`}
                >
                  Course Details
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveSection("lessons")}
                  className={`flex-1 py-2 rounded-lg text-center transition-all duration-300 ${activeSection === "lessons" ? "bg-white text-indigo-600 shadow-md" : "text-indigo-500 hover:bg-indigo-100"}`}
                >
                  Lessons
                </button>
              </div>

              {/* Basic details section */}
              <div className={`space-y-4 transition-all duration-500 ${activeSection === "basic" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full absolute"}`} style={{ display: activeSection === "basic" ? "block" : "none" }}>
                {[
                  { name: 'title', placeholder: 'Course Title', type: 'text', icon: '📚' },
                  { name: 'description', placeholder: 'Course Description', type: 'text', icon: '📝' },
                  { name: 'price', placeholder: 'Price', type: 'number', icon: '💰' },
                  { name: 'imageUrl', placeholder: 'Image URL', type: 'text', icon: '🖼️' },
                ].map((field, index) => (
                  <div key={field.name} 
                    className="relative transform transition-all duration-300 hover:scale-102 group"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.5s ease-out forwards",
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl transform -skew-x-2 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <span className="absolute left-4 top-3.5 text-lg transition-all duration-300">
                      {field.icon}
                    </span>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pl-12 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition-all duration-300 group-hover:border-indigo-400 focus:shadow-indigo-100 focus:shadow-lg"
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-700 group-hover:w-full"></div>
                  </div>
                ))}
                
                <div className="flex justify-end pt-4">
                  <button 
                    type="button"
                    onClick={() => setActiveSection("lessons")}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 hover:translate-y-1 flex items-center gap-2"
                  >
                    <span>Continue to Lessons</span>
                    <span className="animate-bounce">→</span>
                  </button>
                </div>
              </div>

              {/* Lessons section */}
              <div className={`transition-all duration-500 ${activeSection === "lessons" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full absolute"}`} style={{ display: activeSection === "lessons" ? "block" : "none" }}>
                <div className="space-y-8">
                  {formData.lessons.map((lesson, index) => (
                    <div 
                      key={index} 
                      className="relative p-6 bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-sm border border-indigo-100 transform transition-all duration-500 hover:shadow-md hover:border-indigo-300"
                      style={{ animation: `fadeInRight ${0.3 + index * 0.1}s ease-out forwards` }}
                    >
                      <div className="absolute -top-3 left-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm px-4 py-1 rounded-full shadow-sm transform transition-all duration-300 hover:scale-110">
                        Lesson {index + 1}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: 'title', placeholder: 'Lesson Title', icon: '📑' },
                          { name: 'content', placeholder: 'Lesson Content', icon: '📄' },
                          { name: 'duration', placeholder: 'Duration (e.g. 30 mins)', icon: '⏱️' },
                          { name: 'videoUrl', placeholder: 'Video URL', icon: '🎬' },
                        ].map((field) => (
                          <div key={field.name} className="relative group">
                            <span className="absolute left-3 top-3 text-sm text-indigo-500 transition-all duration-300 group-hover:scale-125">{field.icon}</span>
                            <input
                              type="text"
                              name={field.name}
                              placeholder={field.placeholder}
                              value={lesson[field.name]}
                              onChange={(e) => handleChange(e, index)}
                              required
                              className="w-full p-2 pl-8 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white transition-all duration-300 group-hover:border-indigo-400"
                            />
                          </div>
                        ))}
                      </div>
                      
                      {formData.lessons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLesson(index)}
                          className="absolute -top-2 right-2 bg-indigo-100 text-indigo-500 p-2 rounded-full hover:bg-indigo-200 transition-all duration-300 hover:rotate-90"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={addLesson}
                  className="mt-4 px-6 py-3 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200 hover:bg-indigo-200 transition-all duration-300 flex items-center gap-2 hover:shadow-md hover:translate-y-1"
                >
                  <span className="text-lg animate-pulse">+</span> Add Lesson
                </button>
                
                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={() => setActiveSection("basic")}
                    className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl transition-all duration-300 hover:bg-indigo-100 flex items-center gap-2"
                  >
                    <span className="transform rotate-180">→</span>
                    <span>Back to Details</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl transition-all duration-500 hover:shadow-lg hover:shadow-indigo-200 relative overflow-hidden ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:translate-y-1'}`}
                  >
                    <div className="absolute inset-0 w-full h-full">
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-20" 
                        style={{ 
                          animation: "shine 3s infinite linear",
                          transform: "skewX(45deg) translateX(-150%)"
                        }}
                      ></div>
                    </div>
                    
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      <span className="relative z-10">Create Course</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Global CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInRight {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        @keyframes shine {
          0% { transform: skewX(45deg) translateX(-150%); }
          100% { transform: skewX(45deg) translateX(150%); }
        }
        
        @keyframes borderGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0) rotate3d(0, 1, 0, 0deg); }
          50% { transform: translateY(-10px) rotate3d(0, 1, 0, 2deg); }
        }
        
        @keyframes bubble {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in forwards;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CourseCreationForm;