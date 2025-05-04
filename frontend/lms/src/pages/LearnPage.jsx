import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
export default function LearnPage() {
  const { courseId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const scrollRef = useRef(null);

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('http://localhost:7000/api/course/purchased', {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch purchased courses');
        }
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  // Staggered animation for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 80
      }
    }
  };

  // Skeleton loader animation
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 p-6">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent rounded-full animate-spin mb-6"></div>
          <div className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Loading your learning journey...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-10 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Banner */}
      <motion.div 
        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 mb-10 shadow-lg overflow-hidden"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-10 -mb-10"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative">Your Learning Journey</h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-xl relative">
          Pick up where you left off and continue building your skills.
        </p>
      </motion.div>

      {/* Controls Row */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <motion.div 
          className="relative w-full md:w-72"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3 pl-10 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </motion.div>

        <motion.div 
          className="flex gap-2 bg-white p-1 rounded-lg shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === 'list' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
          >
            List
          </button>
        </motion.div>
      </div>

      {/* Empty State */}
      <AnimatePresence>
        {courses.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No courses yet</h2>
            <p className="text-gray-500 mb-6">You haven't purchased any courses. Explore our catalog to start learning!</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Browse Courses
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Grid */}
      <AnimatePresence>
        {filteredCourses.length > 0 && (
          <>
            <motion.p 
              className="text-gray-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            </motion.p>

            {viewMode === 'grid' ? (
              <motion.div 
                ref={scrollRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredCourses.map(course => (
                  <motion.div 
                    key={course._id}
                    layoutId={`card-${course._id}`}
                    variants={itemVariants}
                    onClick={() => setSelectedId(course._id)}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
                    whileHover={{ 
                      y: -10,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
                      >
                        <div className="p-4 w-full">
                          <motion.span 
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full inline-block"
                          >
                            Continue Learning
                          </motion.span>
                        </div>
                      </motion.div>
                      <img 
                        src={course.imageUrl || '/api/placeholder/400/320'} 
                        alt={course.title} 
                        className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <motion.div 
                        className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-md"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{course.title}</h2>
                        <motion.div 
                          className="bg-blue-100 rounded-full p-1.5 flex items-center justify-center"
                          animate={{ 
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                        >
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                        </motion.div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {course.description ? course.description.slice(0, 100) + '...' : "No description available."}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.floor(Math.random() * 100)}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            ></motion.div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          {Math.floor(Math.random() * 100)}% complete
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // List View
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {filteredCourses.map(course => (
                  <motion.div 
                    key={course._id}
                    variants={itemVariants}
                    layoutId={`list-${course._id}`}
                    className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row cursor-pointer"
                    whileHover={{ 
                      y: -4,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                    }}
                  >
                    <div className="md:w-48 relative overflow-hidden">
                      <img 
                        src={course.imageUrl || '/api/placeholder/400/320'} 
                        alt={course.title} 
                        className="w-full h-48 md:h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h2>
                        <p className="text-gray-600 text-sm mb-4">
                          {course.description ? course.description.slice(0, 150) + '...' : "No description available."}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.floor(Math.random() * 100)}%` }}
                              transition={{ duration: 1 }}
                            ></motion.div>
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {Math.floor(Math.random() * 100)}%
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                        >
                          Continue
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Selected Course Modal */}
      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-10"
              onClick={() => setSelectedId(null)}
            />
            <motion.div
              layoutId={`card-${selectedId}`}
              className="fixed inset-x-4 top-14 md:inset-x-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-3/4 md:max-w-2xl bg-white rounded-2xl z-20 overflow-hidden"
            >
              {courses.filter(c => c._id === selectedId).map(course => (
                <div key={course._id} className="flex flex-col">
                  <div className="relative h-56">
                    <img 
                      src={course.imageUrl || '/api/placeholder/400/320'} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6">
                        <h2 className="text-3xl font-bold text-white mb-2">{course.title}</h2>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedId(null)}
                      className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 mb-6">
                      {course.description || "No description available."}
                    </p>
                    <div className="bg-blue-50 p-4 rounded-xl mb-6">
                      <h3 className="font-bold text-blue-800 mb-2">Your Progress</h3>
                      <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden mb-2">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.floor(Math.random() * 100)}%` }}
                          transition={{ duration: 1.5 }}
                        ></motion.div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Progress: {Math.floor(Math.random() * 100)}%</span>
                        <span className="text-blue-700">Last accessed: Yesterday</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedId(null)}
                      >
                        Close
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                        onClick={() => navigate(`/course/learn/${selectedId}`)} // <-- This is the key line
                      >
                        Continue Learning
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
        whileHover={{ scale: 1.1, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      </motion.button>
    </motion.div>
  );
}