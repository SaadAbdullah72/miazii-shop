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
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#fed700] transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none scale-105 blur-sm'
      }`}
    >
      {/* Aspect-ratio locked container to ensure cropping matches image pixels exactly across all screens */}
      <div
        className={`w-full max-w-[480px] aspect-[715/817] px-4 transition-all duration-1000 ease-out transform flex items-center justify-center overflow-hidden bg-[#fed700] ${
          imageLoaded && isVisible ? 'scale-100 opacity-100' : 'scale-98 opacity-0'
        }`}
      >
        <img
          src="/splash-hand.png"
          alt="Miazi Shop"
          className="w-full h-full object-contain"
          style={{
            // Perfect dissolve: merges the image's yellow background with the container background, removing any box outline
            mixBlendMode: 'multiply',
            // Crop out exactly the bottom 22% of the image to keep the full handbag while removing navigation keys
            clipPath: 'inset(0 0 22% 0)',
            // Keep it natural and translate down slightly to perfectly center the handbag on the screen
            transform: isVisible && imageLoaded ? 'scale(1.02) translateY(3%)' : 'scale(1.05) translateY(3%)',
            transition: 'transform 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
