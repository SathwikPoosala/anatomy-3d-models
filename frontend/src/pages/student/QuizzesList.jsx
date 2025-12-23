import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import axios from 'axios';

const QuizzesList = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('studentSidebarOpen');
    return saved === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('studentDarkMode');
    return saved === 'true';
  });
  const [quizzes, setQuizzes] = useState([]);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizzesRes, marksRes] = await Promise.all([
        axios.get('http://localhost:5000/api/quizzes'),
        axios.get('http://localhost:5000/api/marks')
      ]);
      setQuizzes(quizzesRes.data);
      setMarks(marksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const isAttempted = (quizId) => {
    return marks.some(mark => mark.quizId === quizId);
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
          Quizzes
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => {
            const attempted = isAttempted(quiz._id);
            const mark = marks.find(m => m.quizId === quiz._id);

            return (
              <div
                key={quiz._id}
                className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
              >
                <div className="text-5xl mb-4 text-center">📝</div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {quiz.system} Quiz
                </h3>
                <p className={`text-sm mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="font-semibold">Questions:</span> {quiz.questions.length}
                </p>
                <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="font-semibold">Status:</span>{' '}
                  {attempted ? (
                    <span className="text-green-600 font-semibold">Attempted</span>
                  ) : (
                    <span className="text-orange-600 font-semibold">Not Attempted</span>
                  )}
                </p>
                {attempted && mark && (
                  <p className={`text-sm mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="font-semibold">Score:</span> {mark.score}/{mark.totalQuestions} ({mark.percentage}%)
                  </p>
                )}
                <button
                  onClick={() => navigate(`/student/quizzes/${quiz._id}`)}
                  className={`w-full ${
                    darkMode 
                      ? 'bg-teal-700 hover:bg-teal-600' 
                      : 'bg-teal-600 hover:bg-teal-700'
                  } text-white py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
                >
                  {attempted ? 'Retake Quiz' : 'Take Quiz'}
                </button>
              </div>
            );
          })}
        </div>

        {quizzes.length === 0 && (
          <div className={`text-center py-12 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            No quizzes available.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesList;

