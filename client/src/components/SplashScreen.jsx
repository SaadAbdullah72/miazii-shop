import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload the splash image to make sure it displays instantly without white flash
    const img = new Image();
    img.src = '/splash-hand.png';
    img.onload = () => {
      setImageLoaded(true);
    };
    // Fallback if image fails to load
    img.onerror = () => {
      setImageLoaded(true);
    };

    // Splash display duration: 2.4 seconds total, fade out starts at 2.0s
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#fed700] transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none scale-105 blur-sm'
      }`}
    >
      {/* Background radial soft ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Container with custom animations */}
      <div className="relative flex flex-col items-center justify-center px-6 text-center">
        {/* Animated Image Wrapper */}
        <div
          className={`relative max-w-sm w-[85vw] aspect-square rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white/30 bg-[#fed700] transition-all duration-1000 ease-out transform ${
            imageLoaded && isVisible
              ? 'scale-100 rotate-0 opacity-100 translate-y-0'
              : 'scale-90 rotate-[-2deg] opacity-0 translate-y-8'
          }`}
        >
          <img
            src="/splash-hand.png"
            alt="Miazi Shop Splash"
            className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out-quad hover:scale-105"
            style={{
              transform: isVisible && imageLoaded ? 'scale(1.03)' : 'scale(1.15)',
              transition: 'transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          />

          {/* Premium shimmer reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] pointer-events-none" />
        </div>

        {/* Elegant welcome text/logo loading status below */}
        <div 
          className={`mt-8 transition-all duration-700 delay-300 transform ${
            isVisible && imageLoaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="font-['Outfit'] text-[#333e48] text-2xl font-black tracking-wider uppercase drop-shadow-sm">
            MIAZI SHOP
          </h2>
          <p className="text-[#333e48]/70 text-xs font-bold tracking-widest uppercase mt-1">
            Premium Tech & Electronics
          </p>
          
          {/* Minimalist modern progress loader */}
          <div className="w-24 h-[3px] bg-[#333e48]/10 rounded-full mx-auto mt-5 overflow-hidden">
            <div className="h-full bg-[#333e48] rounded-full w-full origin-left animate-[loadingBar_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div 
        className={`absolute bottom-8 text-[10px] font-black tracking-[0.2em] text-[#333e48]/50 uppercase transition-all duration-700 delay-500 ${
          isVisible && imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        Designed for Excellence
      </div>

      {/* Embedded local styles for advanced splash-specific animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        @keyframes loadingBar {
          0% { transform: scaleX(0); transform-origin: left; }
          45% { transform: scaleX(1); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
