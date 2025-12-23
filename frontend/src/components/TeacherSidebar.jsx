import { Link, useLocation } from 'react-router-dom';

const TeacherSidebar = ({ user, onLogout, darkMode, toggleDarkMode, isOpen, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => {
    const baseClass = "flex items-center px-4 py-3 rounded-lg transition-all duration-300";
    const activeClass = darkMode 
      ? "bg-teal-700 text-white" 
      : "bg-teal-100 text-teal-800";
    const inactiveClass = darkMode
      ? "text-slate-300 hover:bg-slate-700"
      : "text-slate-700 hover:bg-slate-100";
    
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 p-2 rounded-lg transition-all duration-300 ${
          isOpen ? 'left-[272px]' : 'left-4'
        } ${
          darkMode 
            ? 'bg-slate-800 text-white hover:bg-slate-700' 
            : 'bg-white text-slate-800 hover:bg-slate-100'
        } shadow-lg`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`${
          darkMode ? 'bg-slate-800' : 'bg-white'
        } w-64 min-h-screen p-6 shadow-lg transition-all duration-300 fixed left-0 top-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            {user?.name}
          </h2>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Teacher Dashboard
          </p>
        </div>

        <nav className="space-y-2">
          <Link to="/teacher/dashboard" className={linkClass('/teacher/dashboard')}>
            <span className="mr-3">📊</span>
            Dashboard
          </Link>
          <Link to="/teacher/models" className={linkClass('/teacher/models')}>
            <span className="mr-3">🧬</span>
            My 3D Models
          </Link>
          <Link to="/teacher/quizzes" className={linkClass('/teacher/quizzes')}>
            <span className="mr-3">📝</span>
            My Quizzes
          </Link>
          <Link to="/teacher/upload-model" className={linkClass('/teacher/upload-model')}>
            <span className="mr-3">➕</span>
            Upload Model
          </Link>
          <Link to="/teacher/add-quiz" className={linkClass('/teacher/add-quiz')}>
            <span className="mr-3">➕</span>
            Add Quiz
          </Link>
          
          <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
            <button
              onClick={toggleDarkMode}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'text-slate-300 hover:bg-slate-700' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="mr-3">{darkMode ? '☀️' : '🌙'}</span>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            
            <button
              onClick={onLogout}
              className={`w-full mt-2 flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'text-red-400 hover:bg-slate-700' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <span className="mr-3">🚪</span>
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay when sidebar is open - only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default TeacherSidebar;

