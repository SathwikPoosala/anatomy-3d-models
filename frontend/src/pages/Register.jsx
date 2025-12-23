import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = ({ onAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Apply dark mode if student dark mode is enabled
    const studentDarkMode = localStorage.getItem('studentDarkMode');
    if (studentDarkMode === 'true') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/auth/register', formData);
      onAuth(res.data.user);
      navigate(res.data.user.role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const isDark = localStorage.getItem('studentDarkMode') === 'true';

  return (
    <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center py-12 px-4 ${
      isDark 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100'
    }`}>
      <div className={`max-w-md w-full rounded-xl shadow-xl p-8 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <h2 className={`text-3xl font-bold text-center mb-8 ${
          isDark ? 'text-white' : 'text-slate-800'
        }`}>
          Register
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isDark 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300'
              }`}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Register
          </button>
        </form>

        <p className={`mt-6 text-center ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

