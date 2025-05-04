import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, User, Book, LogOut, Search, Menu, X, 
         ChevronRight, PlusCircle, Layers, Settings, Users } from "lucide-react";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [teacherStats, setTeacherStats] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const categories = ["All", "Programming", "Design", "Business", "Marketing"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/course/all");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    
    // Fetch teacher stats if user is a teacher
    const fetchTeacherStats = async () => {
      if (user && user.role === "teacher") {
        try {
          const response = await fetch("http://localhost:7000/api/teacher/stats", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          });
          
          if (response.ok) {
            const stats = await response.json();
            setTeacherStats(stats);
          }
        } catch (error) {
          console.error("Error fetching teacher stats:", error);
        }
      }
    };
    
    fetchTeacherStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/auth/signout", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) {
        console.error("Logout failed on server");
      }
      
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || 
                           (course.category && course.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Get teacher's own courses
  const teacherCourses = user && user.role === "teacher" 
    ? courses.filter(course => course.teacher && course.teacher._id === user._id)
    : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity }
    }
  };

  // Check if user is a teacher
  const isTeacher = user && user.role === "teacher";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <motion.header 
        className="bg-white sticky top-0 z-50 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center">
                <motion.div 
                  className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2"
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Book className="text-white" size={20} />
                </motion.div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  LearnHub
                </h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <motion.input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* View Your Courses Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/course/learn/allCourses"
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full flex items-center space-x-2"
                    >
                      <Book size={16} />
                      <span>View Your Courses</span>
                    </Link>
                  </motion.div>
                  {/* Create Course Button - Only for Teachers */}
                  {isTeacher && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/create-course"
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"
                      >
                        <PlusCircle size={16} />
                        <span>Create Course</span>
                      </Link>
                    </motion.div>
                  )}
                  <motion.div 
                    className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700 font-medium">{user.name || user.email}</span>
                      {user.role && (
                        <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                      )}
                    </div>
                  </motion.div>
                  <motion.button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                className="text-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white px-4 py-4 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-700">{user.name || user.email}</span>
                      {user.role && (
                        <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                      )}
                    </div>
                  </div>
                  {/* View Your Courses Button for mobile */}
                  <Link
                    to="/course/learn/allCourses"
                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full w-full flex items-center justify-center space-x-2"
                  >
                    <Book size={16} />
                    <span>View Your Courses</span>
                  </Link>
                  {/* Create Course Button for mobile - Only for Teachers */}
                  {isTeacher && (
                    <Link
                      to="/create-course"
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full w-full flex items-center justify-center space-x-2"
                    >
                      <PlusCircle size={16} />
                      <span>Create Course</span>
                    </Link>
                  )}
                  {/* For teachers - add links to manage courses and students */}
                  {isTeacher && (
                    <>
                      <Link
                        to="/teacher/courses"
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full w-full flex items-center justify-center space-x-2"
                      >
                        <Layers size={16} />
                        <span>My Courses</span>
                      </Link>
                      <Link
                        to="/teacher/students"
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full w-full flex items-center justify-center space-x-2"
                      >
                        <Users size={16} />
                        <span>My Students</span>
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full w-full flex items-center justify-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full w-full text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {isTeacher ? "Teach and Inspire" : "Expand Your Knowledge"}
              </h2>
              <p className="text-lg text-blue-100 mb-6">
                {isTeacher 
                  ? "Share your expertise with students worldwide. Create engaging courses and grow your teaching portfolio."
                  : "Discover thousands of courses taught by expert instructors. Take your skills to the next level and achieve your goals."
                }
              </p>
              <motion.button 
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => isTeacher ? navigate('/create-course') : {}}
              >
                <span>{isTeacher ? "Create a Course" : "Explore Courses"}</span>
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative w-72 h-72">
                <motion.div 
                  className="absolute top-0 left-0 w-64 h-64 bg-white rounded-lg shadow-xl overflow-hidden"
                  animate={{ rotate: [-2, 2], y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  </div>
                </motion.div>
                <motion.div 
                  className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-lg shadow-xl overflow-hidden"
                  animate={{ rotate: [2, -2], y: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                >
                  <div className="h-40 bg-blue-100"></div>
                  <div className="p-4">
                    <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <main className="container mx-auto py-12 px-4">
        {/* Teacher-specific dashboard */}
        {isTeacher && (
          <motion.div
            className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Teacher Dashboard</h3>
              <p className="text-gray-600 mb-6">Manage your courses and track your teaching analytics.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <motion.div 
                  className="bg-white p-4 rounded-lg shadow-md"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">My Courses</h4>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Layers className="text-blue-600" size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{teacherCourses.length}</p>
                  <p className="text-sm text-gray-500">Total courses created</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white p-4 rounded-lg shadow-md"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Students</h4>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="text-green-600" size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{teacherStats ? teacherStats.totalStudents : 0}</p>
                  <p className="text-sm text-gray-500">Students enrolled</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white p-4 rounded-lg shadow-md"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">Rating</h4>
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="text-yellow-600" size={20} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{teacherStats ? teacherStats.averageRating : "4.5"}</p>
                  <p className="text-sm text-gray-500">Average course rating</p>
                </motion.div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <h4 className="font-medium text-gray-800 mb-1">Quick Actions</h4>
                  <p className="text-sm text-gray-500">Manage your teaching activities</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/create-course"
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <PlusCircle size={16} />
                      <span>Create Course</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/teacher/courses"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Layers size={16} />
                      <span>Manage Courses</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/teacher/settings"
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Teacher's own courses section */}
            {teacherCourses.length > 0 && (
              <div className="mt-4 px-6 pb-6">
                <h4 className="font-medium text-gray-800 mb-4">My Recent Courses</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {teacherCourses.slice(0, 3).map((course) => (
                    <motion.div 
                      key={course._id}
                      className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4"
                      whileHover={{ y: -3 }}
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Book size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800 line-clamp-1">{course.title}</h5>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500">{course.students?.length || 0} students</span>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-500 mr-1" />
                            <span>{course.rating || "New"}</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/course/${course._id}/edit`} className="text-blue-600 hover:text-blue-800">
                        <Settings size={18} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                {teacherCourses.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link to="/teacher/courses" className="text-blue-600 font-medium hover:underline flex items-center justify-center">
                      View all courses <ChevronRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Categories */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Browse Categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Courses section */}
        <section>
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedCategory === "All" ? "Available Courses" : `${selectedCategory} Courses`}
            </h3>
            <motion.button
              className="text-blue-600 font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <span>View all</span>
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div 
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : error ? (
            <motion.div 
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <p>{error}</p>
              </div>
            </motion.div>
          ) : filteredCourses.length === 0 ? (
            <motion.div 
              className="text-center py-16 bg-gray-50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="text-gray-400 mb-4"
                animate={pulseVariants.pulse}
              >
                <Search size={64} className="mx-auto" />
              </motion.div>
              <p className="text-gray-500 text-lg mb-4">No courses found matching your criteria.</p>
              <motion.button 
                className="text-blue-600 font-medium"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                whileHover={{ scale: 1.05 }}
              >
                Clear filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCourses.map((course) => (
                <motion.div 
                  key={course._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-48 bg-gray-300 relative overflow-hidden">
                    {course.imageUrl ? (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
                        <Book size={48} className="text-white" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {course.category || "General"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-xl mb-2 text-gray-800 line-clamp-1">{course.title}</h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-500">
                        {course.teacher ? course.teacher.name : "Unknown Instructor"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 mr-1" size={16} />
                        <span className="text-sm font-medium">
                          {course.rating || "4.5"} ({course.reviews || "32"})
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-1" />
                        <span>{course.duration || "6 weeks"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      {course.price ? (
                        <span className="font-bold text-lg">${course.price.toFixed(2)}</span>
                      ) : (
                        <span className="font-bold text-lg text-green-600">Free</span>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={`/course/${course._id}`}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center"
                        >
                          View Course <ChevronRight size={16} className="ml-1" />
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Featured section - Modified based on user role */}
        <motion.section 
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className={`bg-gradient-to-r ${isTeacher ? 'from-green-600 to-blue-600' : 'from-purple-600 to-blue-600'} rounded-2xl p-8 md:p-12 text-white`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="md:w-3/5 mb-8 md:mb-0">
                <motion.h2 
                  className="text-3xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {isTeacher ? "Manage Your Courses" : "Become an Instructor"}
                </motion.h2>
                <motion.p 
                  className="text-purple-100 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {isTeacher 
                    ? "Create engaging content, manage your existing courses, and connect with your students. Track your progress and grow your teaching career."
                    : "Share your knowledge and skills with thousands of learners worldwide. Create engaging courses and earn while making a difference."}
                </motion.p>
                <motion.button 
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  onClick={() => isTeacher ? navigate("/create-course") : navigate("/become-teacher")}
                >
                  {isTeacher ? (
                    <>Create New Course <PlusCircle size={18} className="ml-1" /></>
                  ) : (
                    <>Start Teaching Today <ChevronRight size={18} className="ml-1" /></>
                  )}
                </motion.button>
              </div>
              <motion.div 
                className="md:w-2/5 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative w-56 h-56">
                  <motion.div 
                    className={`absolute w-40 h-40 ${isTeacher ? 'bg-green-400' : 'bg-purple-400'} bg-opacity-30 rounded-full`}
                    animate={{ 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute left-8 w-40 h-40 bg-blue-400 bg-opacity-30 rounded-full"
                    animate={{ 
                      scale: [1.2, 1, 1.2],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute top-8 left-8 w-40 h-40 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Book size={64} className={`${isTeacher ? 'text-green-600' : 'text-purple-600'}`} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* New section for teachers: Course creation tips */}
        {isTeacher && (
          <motion.section
            className="mt-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Tips for Creating Engaging Courses</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div 
                  className="bg-blue-50 p-6 rounded-lg"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                    >
                      <Book size={24} className="text-blue-600" />
                    </motion.div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">Structure Your Content</h4>
                  <p className="text-gray-600">Break your course into logical sections and lessons. Create a clear learning path that keeps students engaged.</p>
                </motion.div>
                
                <motion.div 
                  className="bg-green-50 p-6 rounded-lg"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Users size={24} className="text-green-600" />
                    </motion.div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">Know Your Audience</h4>
                  <p className="text-gray-600">Tailor your content to your target audience's needs. Consider their skill level and learning objectives.</p>
                </motion.div>
                
                <motion.div 
                  className="bg-purple-50 p-6 rounded-lg"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star size={24} className="text-purple-600" />
                    </motion.div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">Include Practical Examples</h4>
                  <p className="text-gray-600">Illustrate concepts with real-world examples and hands-on projects to reinforce learning and engagement.</p>
                </motion.div>
              </div>
              
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg"
                  onClick={() => navigate("/teaching-resources")}
                >
                  Explore Teaching Resources
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <Book className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  LearnHub
                </h2>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering learners worldwide with quality education and skills development.
              </p>
              <div className="flex space-x-4">
                <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ scale: 1.2 }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </motion.a>
                <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ scale: 1.2 }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </motion.a>
                <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ scale: 1.2 }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                {isTeacher && (
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Teaching Resources</a></li>
                )}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.filter(cat => cat !== "All").map(category => (
                  <li key={category}>
                    <a href="#" className="text-gray-400 hover:text-white transition">{category}</a>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;