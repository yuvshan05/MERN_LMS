import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import ViewCourse from './pages/ViewCourse.jsx';
import CreateCourse from './pages/CreateCourse.jsx'; 
import LearnPage from './pages/LearnPage.jsx';
import { Toaster } from 'react-hot-toast'; // ✅ imported
import CourseLearnPage from './pages/CourseLearnPage.jsx';


function App() {
  return (
    <Router>
      {/* ✅ Toaster placed here */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/course/:courseId" element={<ViewCourse />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/course/learn/allCourses" element={<LearnPage />} />
        <Route path="/course/learn/:courseId" element={<CourseLearnPage />} />

      </Routes>
    </Router>
  );
}

export default App;
