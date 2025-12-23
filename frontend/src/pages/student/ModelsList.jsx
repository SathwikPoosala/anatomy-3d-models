import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import axios from 'axios';

const ModelsList = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('studentSidebarOpen');
    return saved === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('studentDarkMode');
    return saved === 'true';
  });
  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSystem, setFilterSystem] = useState('');

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
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await axios.get('/api/models');
      setModels(res.data);
    } catch (error) {
      console.error('Error fetching models:', error);
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

  const systems = [...new Set(models.map(m => m.system))];

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.system.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSystem = !filterSystem || model.system === filterSystem;
    return matchesSearch && matchesSystem;
  });

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
          3D Anatomy Models
        </h1>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 min-w-[200px] px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-white border-slate-300'
            } focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
          <select
            value={filterSystem}
            onChange={(e) => setFilterSystem(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-white' 
                : 'bg-white border-slate-300'
            } focus:outline-none focus:ring-2 focus:ring-teal-500`}
          >
            <option value="">All Systems</option>
            {systems.map(system => (
              <option key={system} value={system}>{system}</option>
            ))}
          </select>
        </div>

        {/* Models Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map(model => (
            <div
              key={model._id}
              onClick={() => navigate(`/student/models/${model._id}`)}
              className={`${darkMode ? 'bg-slate-800' : 'bg-white'} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
            >
              <div className="text-5xl mb-4 text-center">🧬</div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {model.name}
              </h3>
              <p className={`text-sm mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="font-semibold">System:</span> {model.system}
              </p>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="font-semibold">Teacher:</span> {model.teacherId?.name || 'Unknown'}
              </p>
              {model.description && (
                <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {model.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className={`text-center py-12 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            No models found. Try adjusting your search or filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsList;

