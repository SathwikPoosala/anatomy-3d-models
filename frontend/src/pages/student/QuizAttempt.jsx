import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import axios from 'axios';

const QuizAttempt = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('studentSidebarOpen');
    return saved === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('studentDarkMode');
    return saved === 'true';
  });
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

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
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
      setQuiz(res.data);
      // Initialize answers object
      const initialAnswers = {};
      res.data.questions.forEach((_, index) => {
        initialAnswers[index] = '';
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching quiz:', error);
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

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const handleSubmit = async () => {
    const answersArray = Object.keys(answers).map(key => answers[key]);
    
    try {
      const res = await axios.post(`http://localhost:5000/api/quizzes/${id}/submit`, {
        answers: answersArray
      });
      setScore(res.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    }
  };

  if (!quiz) {
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
        <div className={`flex-1 p-8 pt-20 flex items-center justify-center transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          <p className={`text-xl ${darkMode ? 'text-white' : 'text-slate-800'}`}>Loading quiz...</p>
        </div>
      </div>
    );
  }

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
        <div className="mb-6 flex gap-4">
          <Link 
            to="/student/quizzes" 
            className={`inline-block text-sm ${darkMode ? 'text-teal-400' : 'text-teal-600'} hover:underline`}
          >
            ← Back to Quizzes
          </Link>
          <Link 
            to="/student/dashboard" 
            className={`inline-block text-sm ${darkMode ? 'text-teal-400' : 'text-teal-600'} hover:underline`}
          >
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          {quiz.system} Quiz
        </h1>

        {submitted && score ? (
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-8 rounded-xl shadow-lg mb-6`}>
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              Quiz Submitted!
            </h2>
            <p className={`text-xl mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Score: {score.score} / {score.totalQuestions}
            </p>
            <p className={`text-xl mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Percentage: {score.percentage}%
            </p>
            <button
              onClick={() => navigate('/student/quizzes')}
              className={`${
                darkMode 
                  ? 'bg-teal-700 hover:bg-teal-600' 
                  : 'bg-teal-600 hover:bg-teal-700'
              } text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
            >
              Back to Quizzes
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}
                >
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    Question {index + 1}: {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          answers[index] === option
                            ? darkMode
                              ? 'bg-teal-800 border-2 border-teal-600'
                              : 'bg-teal-100 border-2 border-teal-600'
                            : darkMode
                            ? 'bg-slate-700 hover:bg-slate-600'
                            : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={() => handleAnswerChange(index, option)}
                          className="mr-3"
                        />
                        <span className={darkMode ? 'text-white' : 'text-slate-800'}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={Object.values(answers).some(a => !a)}
              className={`${
                Object.values(answers).some(a => !a)
                  ? 'bg-slate-400 cursor-not-allowed'
                  : darkMode
                  ? 'bg-teal-700 hover:bg-teal-600'
                  : 'bg-teal-600 hover:bg-teal-700'
              } text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105`}
            >
              Submit Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;

