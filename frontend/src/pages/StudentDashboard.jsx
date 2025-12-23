import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import axios from 'axios';

const StudentDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('studentSidebarOpen');
    return saved === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem('studentDarkMode');
    return saved === 'true';
  });
  const [stats, setStats] = useState({
    totalModels: 0,
    totalQuizzes: 0,
    attemptedQuizzes: 0
  });

  useEffect(() => {
    // Apply dark mode to entire website
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('studentDarkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [modelsRes, quizzesRes, marksRes] = await Promise.all([
        axios.get('/api/models'),
        axios.get('/api/quizzes'),
        axios.get('/api/marks')
      ]);

      setStats({
        totalModels: modelsRes.data.length,
        totalQuizzes: quizzesRes.data.length,
        attemptedQuizzes: marksRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('studentSidebarOpen', newState.toString());
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <StudentSidebar 
        user={user} 
        onLogout={onLogout} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className={`flex-1 p-8 pt-20 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <div className="mb-6">
          <Link 
            to="/student/dashboard" 
            className={`inline-block text-sm ${darkMode ? 'text-teal-400' : 'text-teal-600'} hover:underline`}
          >
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Welcome, {user?.name}!
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
            <div className="text-4xl mb-4">🧬</div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Available Models
            </h3>
            <p className={`text-3xl font-bold ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
              {stats.totalModels}
            </p>
          </div>

          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
            <div className="text-4xl mb-4">📝</div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Total Quizzes
            </h3>
            <p className={`text-3xl font-bold ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
              {stats.totalQuizzes}
            </p>
          </div>

          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
            <div className="text-4xl mb-4">✅</div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Attempted
            </h3>
            <p className={`text-3xl font-bold ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
              {stats.attemptedQuizzes}
            </p>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/student/models')}
              className={`${darkMode ? 'bg-teal-700 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'} text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
            >
              Explore 3D Models
            </button>
            <button
              onClick={() => navigate('/student/quizzes')}
              className={`${darkMode ? 'bg-teal-700 hover:bg-teal-600' : 'bg-teal-600 hover:bg-teal-700'} text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
            >
              Take a Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

