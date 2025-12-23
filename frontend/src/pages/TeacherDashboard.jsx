import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../components/TeacherSidebar';

const TeacherDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('teacherSidebarOpen');
    return saved === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('teacherDarkMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('teacherDarkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('teacherSidebarOpen', newState.toString());
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <TeacherSidebar 
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
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            Dashboard
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            onClick={() => navigate('/teacher/models')}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
          >
            <div className="text-6xl mb-4 text-center">🧬</div>
            <h3 className={`text-2xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              My 3D Models
            </h3>
            <p className={`text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              View and manage your uploaded 3D anatomy models
            </p>
          </div>

          <div
            onClick={() => navigate('/teacher/quizzes')}
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
          >
            <div className="text-6xl mb-4 text-center">📝</div>
            <h3 className={`text-2xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              My Quizzes
            </h3>
            <p className={`text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              View and manage your created quizzes
            </p>
          </div>
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Quick Actions
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/teacher/upload-model')}
                  className={`${
                    darkMode 
                      ? 'bg-teal-700 hover:bg-teal-600' 
                      : 'bg-teal-600 hover:bg-teal-700'
                  } text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
                >
                  Upload New Model
                </button>
                <button
                  onClick={() => navigate('/teacher/add-quiz')}
                  className={`${
                    darkMode 
                      ? 'bg-teal-700 hover:bg-teal-600' 
                      : 'bg-teal-600 hover:bg-teal-700'
                  } text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
                >
                  Add New Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

