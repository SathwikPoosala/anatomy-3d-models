import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ModelsList from './pages/student/ModelsList';
import ModelView from './pages/student/ModelView';
import QuizzesList from './pages/student/QuizzesList';
import QuizAttempt from './pages/student/QuizAttempt';
import Marks from './pages/student/Marks';
import TeacherModels from './pages/teacher/TeacherModels';
import TeacherQuizzes from './pages/teacher/TeacherQuizzes';
import UploadModel from './pages/teacher/UploadModel';
import AddQuiz from './pages/teacher/AddQuiz';

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // Load student dark mode preference on app start
    const studentDarkMode = localStorage.getItem('studentDarkMode');
    if (studentDarkMode === 'true') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setUser(res.data.user);
      // Apply dark mode if student and preference is set
      if (res.data.user?.role === 'student') {
        const studentDarkMode = localStorage.getItem('studentDarkMode');
        if (studentDarkMode === 'true') {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        }
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'} /> : <Register onAuth={setUser} />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'} /> : <Login onAuth={setUser} />} 
        />
        
        {/* Student Routes */}
        <Route 
          path="/student/dashboard" 
          element={user?.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/student/models" 
          element={user?.role === 'student' ? <ModelsList user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/student/models/:id" 
          element={user?.role === 'student' ? <ModelView user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/student/quizzes" 
          element={user?.role === 'student' ? <QuizzesList user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/student/quizzes/:id" 
          element={user?.role === 'student' ? <QuizAttempt user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/student/marks" 
          element={user?.role === 'student' ? <Marks user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        {/* Teacher Routes */}
        <Route 
          path="/teacher/dashboard" 
          element={user?.role === 'teacher' ? <TeacherDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher/models" 
          element={user?.role === 'teacher' ? <TeacherModels user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher/quizzes" 
          element={user?.role === 'teacher' ? <TeacherQuizzes user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher/upload-model" 
          element={user?.role === 'teacher' ? <UploadModel user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/teacher/add-quiz" 
          element={user?.role === 'teacher' ? <AddQuiz user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;

