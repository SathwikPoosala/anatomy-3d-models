import { useState, useEffect } from 'react';

const ModelViewer = ({ modelUrl, modelName, darkMode }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-[10000] bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg"
        >
          Exit Fullscreen
        </button>
        <model-viewer
          src={modelUrl}
          alt={modelName}
          auto-rotate
          camera-controls
          style={{ width: '100%', height: '100%' }}
        ></model-viewer>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-black rounded-xl overflow-hidden shadow-xl">
      <model-viewer
        src={modelUrl}
        alt={modelName}
        auto-rotate
        camera-controls
        style={{ width: '100%', height: '100%' }}
      ></model-viewer>
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg z-10"
      >
        ⛶
      </button>
    </div>
  );
};

export default ModelViewer;

