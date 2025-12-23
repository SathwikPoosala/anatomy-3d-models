import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/TeacherSidebar';
import axios from 'axios';

const TeacherQuizzes = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('teacherSidebarOpen');
    return saved === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('teacherDarkMode');
    return saved === 'true';
  });
  const [quizzes, setQuizzes] = useState([]);

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

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('/api/quizzes/teacher');
      setQuizzes(res.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('teacherSidebarOpen', newState.toString());
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await axios.delete(`/api/quizzes/${id}`);
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error deleting quiz. Please try again.');
    }
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
        <div className="mb-6 flex justify-between items-center">
          <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            My Quizzes
          </h2>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <div
              key={quiz._id}
              className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="text-5xl mb-4 text-center">📝</div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {quiz.system} Quiz
              </h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="font-semibold">Questions:</span> {quiz.questions.length}
              </p>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="font-semibold">Created:</span> {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDelete(quiz._id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className={`text-center py-12 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            No quizzes created yet. Click "Add New Quiz" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherQuizzes;

