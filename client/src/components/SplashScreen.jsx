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

    // Splash display duration: 2.2 seconds total, fade out starts at 1.8s
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
      if (onComplete) onComplete();
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#FFDC00] transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none scale-105 blur-sm'
      }`}
    >
      {/* Dynamic container that matches width exactly on mobile to ensure zero side-gaps */}
      <div
        className={`w-full max-w-[480px] h-auto relative overflow-hidden bg-[#FFDC00] ${
          imageLoaded && isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          // Container level clipping with Webkit prefix to prevent any Webkit browser rendering conflicts
          webkitClipPath: 'inset(0 0 25% 0)',
          clipPath: 'inset(0 0 25% 0)'
        }}
      >
        <img
          src="/splash-hand.png"
          alt="Miazi Shop"
          className="w-full h-auto object-contain"
          style={{
            // Smooth micro-scale and translateY for a premium slide-up entry from bottom
            transform: isVisible && imageLoaded 
              ? 'scale(1.02) translateY(3%)' 
              : 'scale(1.02) translateY(12%)',
            transition: 'transform 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.5s ease-out',
            opacity: isVisible && imageLoaded ? 1 : 0
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
