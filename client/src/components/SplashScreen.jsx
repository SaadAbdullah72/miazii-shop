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
      {/* Full screen centered splash image with virtual button cropping and custom layout */}
      <div
        className={`w-full h-full transition-all duration-1000 ease-out transform flex items-center justify-center overflow-hidden bg-[#fed700] ${
          imageLoaded && isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <img
          src="/splash-hand.png"
          alt="Miazi Shop"
          className="w-full h-full object-contain"
          style={{
            // Crop out the bottom 12% of the image to completely remove the Android virtual buttons (lines, circle, back)
            clipPath: 'inset(0 0 12% 0)',
            // Align the remaining hand & bag centrally and scale beautifully
            transform: isVisible && imageLoaded ? 'scale(1.15) translateY(-4%)' : 'scale(1.22) translateY(-4%)',
            transition: 'transform 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
