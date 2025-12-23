import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const heroContentRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);

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

    // Initial hero animation
    const hero = document.querySelector('.hero-section');
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'scale(0.95)';
      setTimeout(() => {
        hero.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
        hero.style.opacity = '1';
        hero.style.transform = 'scale(1)';
      }, 100);
    }

    // Scroll-based animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation for feature cards
          const delay = entry.target.classList.contains('feature-card') 
            ? index * 100 
            : 0;
          
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1) translateY(0)';
          }, delay);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.96) translateY(30px)';
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      
      // Add feature-card class to feature cards for staggered animation
      if (el.closest('.grid.md\\:grid-cols-3')) {
        el.classList.add('feature-card');
      }
      
      observer.observe(el);
    });

    // Subtle parallax effect for hero content on scroll
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroContent = heroContentRef.current;
      if (heroContent && scrolled < window.innerHeight) {
        // Subtle fade and move effect
        const opacity = Math.max(0.7, 1 - scrolled / (window.innerHeight * 0.8));
        const translateY = scrolled * 0.2;
        heroContent.style.opacity = opacity;
        heroContent.style.transform = `translateY(${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isDark = localStorage.getItem('studentDarkMode') === 'true';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100'
    }`}>
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto"
            style={{
              transform: 'translate(-50%, -50%) scale(1.1)',
              objectFit: 'cover',
              opacity: 0.7
            }}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/heart-preview.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Opacity Overlay */}
        <div className="absolute inset-0 bg-black/40 z-[5]"></div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 via-neutral-700/20 to-neutral-800/30 z-10"></div>
        
        {/* Content Layer */}
        <div className="container mx-auto px-6 py-20 z-20 relative" ref={heroContentRef}>
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-2xl text-white">
              AR-Based Anatomy Learning
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-lg text-slate-100">
              Interactive 3D anatomy models and quizzes for medical students
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-2xl drop-shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section ref={featuresRef} className={`py-20 transition-colors duration-300 ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-4xl font-bold text-center mb-16 scroll-animate ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}>
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 scroll-animate ${
              isDark 
                ? 'bg-slate-700' 
                : 'bg-gradient-to-br from-teal-50 to-slate-50'
            }`}>
              <div className="text-5xl mb-4">🧬</div>
              <h3 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>
                3D Anatomy Models
              </h3>
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                Explore interactive 3D models of human anatomy systems with detailed views and rotations.
              </p>
            </div>

            <div className={`p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 scroll-animate ${
              isDark 
                ? 'bg-slate-700' 
                : 'bg-gradient-to-br from-teal-50 to-slate-50'
            }`}>
              <div className="text-5xl mb-4">📝</div>
              <h3 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>
                Interactive Quizzes
              </h3>
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                Test your knowledge with comprehensive quizzes designed by medical educators.
              </p>
            </div>

            <div className={`p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 scroll-animate ${
              isDark 
                ? 'bg-slate-700' 
                : 'bg-gradient-to-br from-teal-50 to-slate-50'
            }`}>
              <div className="text-5xl mb-4">👥</div>
              <h3 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}>
                Role-Based Learning
              </h3>
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                Tailored dashboards for students and teachers with appropriate access and features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className={`py-20 transition-colors duration-300 ${
        isDark ? 'bg-slate-900' : 'bg-slate-50'
      }`}>
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className={`text-4xl font-bold text-center mb-12 scroll-animate ${
            isDark ? 'text-white' : 'text-slate-800'
          }`}>
            About
          </h2>
          <div className={`space-y-6 text-lg leading-relaxed scroll-animate ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <p>
              Medical education requires comprehensive understanding of human anatomy, which can be challenging 
              with traditional 2D textbooks and diagrams. Our AR-Based Anatomy Learning Tool addresses this 
              challenge by providing interactive 3D models that students can explore from every angle.
            </p>
            <p>
              The platform enables medical students to visualize complex anatomical structures, test their 
              knowledge through quizzes, and track their progress. Teachers can upload 3D models and create 
              quizzes to enhance the learning experience.
            </p>
            <p>
              Built with modern web technologies, this tool makes anatomy learning more engaging, accessible, 
              and effective for the next generation of medical professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-300">
            © 2024 AR-Based Anatomy Learning Tool. Built with MERN Stack.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

