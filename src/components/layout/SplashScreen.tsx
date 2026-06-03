import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "../../assets/images/farmetra_logo_1780246757391.png";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    // Cycle dots during load simulation
    const dotInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 4);
    }, 600);

    // Fade out splash after 2.8 seconds
    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#F4F9F4] z-[200] flex flex-col justify-between items-center py-16 px-6 font-sans overflow-hidden select-none">
      {/* Top hanging vine design from first mockup */}
      <div className="absolute top-0 inset-x-0 flex justify-between px-12 pointer-events-none opacity-50">
        <svg width="60" height="150" viewBox="0 0 60 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0V80C30 95 10 105 10 120C10 135 30 140 30 150" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 40C45 40 50 25 40 15C30 5 20 20 30 40Z" fill="#1B4332" fillOpacity="0.1" stroke="#1B4332" strokeWidth="1.5" />
          <path d="M30 70C15 70 10 85 20 95C30 105 40 90 30 70Z" fill="#1B4332" fillOpacity="0.1" stroke="#1B4332" strokeWidth="1.5" />
        </svg>
        <svg width="60" height="150" viewBox="0 0 60 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform scale-x-[-1]">
          <path d="M30 0V80C30 95 10 105 10 120C10 135 30 140 30 150" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 40C45 40 50 25 40 15C30 5 20 20 30 40Z" fill="#1B4332" fillOpacity="0.1" stroke="#1B4332" strokeWidth="1.5" />
          <path d="M30 70C15 70 10 85 20 95C30 105 40 90 30 70Z" fill="#1B4332" fillOpacity="0.1" stroke="#1B4332" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Main Logo Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center mt-8 relative z-10"
      >
        <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white mb-2 relative bg-white">
          <img 
            src={logoImg} 
            alt="Farmetra Logo" 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
          />
        </div>
        <p className="text-[#1B4332] text-[11px] font-black tracking-[0.25em] uppercase opacity-70">
          Agricultural Intelligence
        </p>
      </motion.div>

      {/* Scenic vector landscape from mockup (cottage, layered hills, trails) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="w-full max-w-lg h-44 relative bg-transparent rounded-[32px] overflow-hidden"
      >
        <svg viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Sky background */}
          <rect width="500" height="200" fill="#E6F2E6" rx="24" />
          
          {/* Back hills (light green) */}
          <path d="M-50 150Q75 80 200 130Q325 180 450 120Q510 100 550 110V210H-50Z" fill="#C7E2C7" />
          
          {/* Mid hills (medium green) */}
          <path d="M-30 170Q120 110 250 160Q380 210 520 140V210H-30Z" fill="#A8D1A8" />
          
          {/* Front crop rows & field lanes (curved paths) */}
          <path d="M-20 200C100 160 180 190 300 155C420 120 480 180 520 160V200H-20Z" fill="#88BF88" />
          
          {/* Lane dividers / agricultural crop rows (lines matching mockup) */}
          <path d="M120 170C150 185 180 195 210 198" stroke="#6F9D6F" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M260 170C280 178 310 182 340 183" stroke="#6F9D6F" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M380 160C410 168 440 178 470 185" stroke="#6F9D6F" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Cottage / House from mockup */}
          <g transform="translate(140, 115) scale(0.95)">
            {/* Base walls */}
            <rect x="10" y="22" width="28" height="18" fill="#FBF0D9" stroke="#5C4D3C" strokeWidth="1.5" />
            <polygon points="10,22 24,10 38,22" fill="#E56A54" stroke="#5C4D3C" strokeWidth="1.5" />
            {/* Door and windows */}
            <rect x="22" y="30" width="6" height="10" fill="#8F5E48" />
            <rect x="14" y="25" width="4" height="4" fill="#6EB5D0" />
            <rect x="30" y="25" width="4" height="4" fill="#6EB5D0" />
            {/* Small chimney */}
            <rect x="32" y="12" width="3" height="8" fill="#5C4D3C" />
          </g>

          {/* Little trees */}
          <g transform="translate(195, 125)">
            <rect x="4" y="10" width="2" height="6" fill="#5C4D3C" />
            <circle cx="5" cy="6" r="6" fill="#4B8B4B" />
          </g>
          <g transform="translate(85, 140) scale(1.2)">
            <rect x="4" y="10" width="2" height="6" fill="#5C4D3C" />
            <path d="M5 2L1 11H9Z" fill="#3E7D3E" />
          </g>
          <g transform="translate(320, 145) scale(0.8)">
            <rect x="4" y="10" width="2" height="6" fill="#5C4D3C" />
            <circle cx="5" cy="6" r="7" fill="#4B8B4B" />
          </g>
        </svg>
      </motion.div>

      {/* Loading navigation indicator & feedback */}
      <div className="flex flex-col items-center gap-6 mb-4">
        {/* Loading dots indicators resembling first mockup */}
        <div className="flex items-center gap-3">
          {[0, 1, 2, 3].map((dotIndex) => (
            <motion.div
              key={dotIndex}
              className={`w-3.5 h-3.5 rounded-full transition-colors duration-300`}
              animate={{
                backgroundColor: dotIndex === activeDot ? "#1B4332" : "#D1E2D1",
                scale: dotIndex === activeDot ? 1.25 : 1,
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-1.5 pt-1">
          <p className="text-xs font-black text-[#1B4332]/60 uppercase tracking-[0.3em] font-mono">
            Loading...
          </p>
          <span className="text-[10px] text-emerald-800 font-bold opacity-50 uppercase tracking-widest">
            Ready to Detect, Protect & Grow
          </span>
        </div>
      </div>
    </div>
  );
}
