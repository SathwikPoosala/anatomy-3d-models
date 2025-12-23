import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/TeacherSidebar';
import axios from 'axios';

const AddQuiz = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('teacherSidebarOpen');
    return saved === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('teacherDarkMode');
    return saved === 'true';
  });
  const [system, setSystem] = useState('');
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSystemChange = (e) => {
    setSystem(e.target.value);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'question') {
      updatedQuestions[index].question = value;
    } else if (field.startsWith('option')) {
      const optIndex = parseInt(field.replace('option', ''));
      updatedQuestions[index].options[optIndex] = value;
    } else if (field === 'correctAnswer') {
      updatedQuestions[index].correctAnswer = value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate
    if (!system) {
      setError('System is required');
      setLoading(false);
      return;
    }

    for (const q of questions) {
      if (!q.question || q.options.some(opt => !opt) || !q.correctAnswer) {
        setError('All fields are required for each question');
        setLoading(false);
        return;
      }
      if (!q.options.includes(q.correctAnswer)) {
        setError('Correct answer must be one of the options');
        setLoading(false);
        return;
      }
    }

    try {
      await axios.post('/api/quizzes', {
        system,
        questions
      });
      navigate('/teacher/quizzes');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating quiz');
    } finally {
      setLoading(false);
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

      <div className={`flex-1 p-8 pt-20 max-w-4xl mx-auto transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <h2 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Create New Quiz
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-8 rounded-xl shadow-lg space-y-8`}>
          <div>
            <label className={`block font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Body System *
            </label>
            <input
              type="text"
              value={system}
              onChange={handleSystemChange}
              required
              placeholder="e.g., Cardiovascular, Respiratory, Nervous"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300'
              }`}
            />
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className={`border rounded-lg p-6 ${
              darkMode ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Question {qIndex + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mb-4">
                <label className={`block font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Question *
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-slate-300'
                  }`}
                />
              </div>

              <div className="mb-4">
                <label className={`block font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Options *
                </label>
                {question.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={option}
                    onChange={(e) => handleQuestionChange(qIndex, `option${optIndex}`, e.target.value)}
                    required
                    placeholder={`Option ${optIndex + 1}`}
                    className={`w-full px-4 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      darkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-slate-300'
                    }`}
                  />
                ))}
              </div>

              <div>
                <label className={`block font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Correct Answer *
                </label>
                <select
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-slate-300'
                  }`}
                >
                  <option value="">Select correct answer</option>
                  {question.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option || `Option ${optIndex + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className={`w-full border-2 border-dashed py-3 rounded-lg font-semibold transition-all duration-300 ${
              darkMode
                ? 'border-teal-600 text-teal-400 hover:bg-slate-700'
                : 'border-teal-600 text-teal-600 hover:bg-teal-50'
            }`}
          >
            + Add Another Question
          </button>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 ${
                loading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : darkMode
                  ? 'bg-teal-700 hover:bg-teal-600'
                  : 'bg-teal-600 hover:bg-teal-700'
              } text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
            >
              {loading ? 'Creating...' : 'Create Quiz'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/teacher/quizzes')}
              className={`px-6 py-3 border rounded-lg font-semibold transition-all duration-300 ${
                darkMode
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;

