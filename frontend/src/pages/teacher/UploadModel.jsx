import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/TeacherSidebar';
import axios from 'axios';

const UploadModel = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('teacherSidebarOpen');
    return saved === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('teacherDarkMode');
    return saved === 'true';
  });
  const [formData, setFormData] = useState({
    name: '',
    system: '',
    description: '',
    modelUrl: ''
  });
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.modelUrl.endsWith('.glb')) {
      setError('Model URL must be a .glb file');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/models', formData);
      navigate('/teacher/models');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading model');
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

      <div className={`flex-1 p-8 pt-20 max-w-2xl mx-auto transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <h2 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Upload 3D Model
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-8 rounded-xl shadow-lg space-y-6`}>
          <div>
            <label className={`block font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Organ Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Body System *
            </label>
            <input
              type="text"
              name="system"
              value={formData.system}
              onChange={handleChange}
              required
              placeholder="e.g., Cardiovascular, Respiratory, Nervous"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              3D Model URL (.glb) *
            </label>
            <input
              type="url"
              name="modelUrl"
              value={formData.modelUrl}
              onChange={handleChange}
              required
              placeholder="https://example.com/model.glb"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-slate-300'
              }`}
            />
            <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Paste a direct URL to a .glb 3D model file
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 ${
                loading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700'
              } text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
            >
              {loading ? 'Uploading...' : 'Upload Model'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/teacher/models')}
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

export default UploadModel;

