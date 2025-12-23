import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import axios from 'axios';

const Marks = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('studentSidebarOpen');
    return saved === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('studentDarkMode');
    return saved === 'true';
  });
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('studentDarkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/marks');
      setMarks(res.data);
    } catch (error) {
      console.error('Error fetching marks:', error);
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
          My Marks
        </h1>

        {marks.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            No quiz attempts yet. Start taking quizzes to see your marks here.
          </div>
        ) : (
          <div className="grid gap-4">
            {marks.map((mark, index) => (
              <div
                key={index}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {mark.quizName}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Date: {new Date(mark.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold mb-1 ${
                      mark.percentage >= 70 
                        ? 'text-green-600' 
                        : mark.percentage >= 50 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {mark.percentage}%
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {mark.score} / {mark.totalQuestions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marks;

