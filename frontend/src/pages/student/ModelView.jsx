import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import StudentSidebar from '../../components/StudentSidebar';
import ModelViewer from '../../components/ModelViewer';
import axios from 'axios';

const ModelView = ({ user, onLogout }) => {
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
  const [model, setModel] = useState(null);

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
    fetchModel();
  }, [id]);

  const fetchModel = async () => {
    try {
      const res = await axios.get(`/api/models/${id}`);
      setModel(res.data);
    } catch (error) {
      console.error('Error fetching model:', error);
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

  if (!model) {
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
          <p className={`text-xl ${darkMode ? 'text-white' : 'text-slate-800'}`}>Loading model...</p>
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
            to="/student/models" 
            className={`inline-block text-sm ${darkMode ? 'text-teal-400' : 'text-teal-600'} hover:underline`}
          >
            ← Back to Models
          </Link>
          <Link 
            to="/student/dashboard" 
            className={`inline-block text-sm ${darkMode ? 'text-teal-400' : 'text-teal-600'} hover:underline`}
          >
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          {model.name}
        </h1>
        <p className={`text-lg mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <span className="font-semibold">System:</span> {model.system} | 
          <span className="font-semibold ml-2">Teacher:</span> {model.teacherId?.name || 'Unknown'}
        </p>

        {model.description && (
          <p className={`mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {model.description}
          </p>
        )}

        <div className="mb-6">
          <ModelViewer modelUrl={model.modelUrl} modelName={model.name} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default ModelView;

