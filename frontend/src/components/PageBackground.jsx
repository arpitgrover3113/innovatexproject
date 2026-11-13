import React from 'react';

/**
 * PageBackground
 * Replicates the exact lavender AI SaaS background style from the Hero section
 * (Image 4):
 * - #F0EDFF lavender base
 * - Left multi-layer organic fluid wave ribbons (3D depth layers with light-catching edge)
 * - Right-bottom soft lavender radial horizon swell
 * - Atmospheric central glow
 * - Soft ambient blur orbs
 * - Distributed 4-point sparkle stars (✦)
 */
export const PageBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {/* ── SVG LAYER: Multi-layer Organic Wave Ribbons & Horizon Swell ── */}
      <svg 
        className="w-full h-full" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Left outer flowing ribbon blob */}
          <linearGradient id="pageBgBlobOuter" x1="0" y1="0" x2="600" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="1" />
            <stop offset="40%" stopColor="#DDD6FE" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#EDE9FE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
          </linearGradient>

          {/* Left inner depth ribbon layer */}
          <linearGradient id="pageBgBlobInner" x1="0" y1="0" x2="400" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0" />
          </linearGradient>

          {/* Left caught-light edge highlight */}
          <linearGradient id="pageBgBlobEdge" x1="0" y1="0" x2="80" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.3" />
          </linearGradient>

          {/* Right bottom soft horizon swell */}
          <radialGradient id="pageBgRightSwell" cx="85%" cy="90%" r="45%" fx="85%" fy="90%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.65" />
            <stop offset="45%" stopColor="#DDD6FE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
          </radialGradient>

          {/* Top right subtle warm glow */}
          <radialGradient id="pageBgTopRightGlow" cx="90%" cy="10%" r="35%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
          </radialGradient>

          {/* Gaussian blur filters for smooth depth */}
          <filter id="pageBgSoftBlur">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="pageBgMedBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Base lavender tint */}
        <rect width="1440" height="900" fill="#F0EDFF" />

        {/* Central soft atmospheric glow */}
        <ellipse cx="720" cy="450" rx="600" ry="350" fill="white" fillOpacity="0.35" filter="url(#pageBgSoftBlur)" />

        {/* Right bottom soft swell */}
        <ellipse cx="1300" cy="850" rx="520" ry="420" fill="url(#pageBgRightSwell)" filter="url(#pageBgSoftBlur)" />

        {/* Top right subtle glow */}
        <ellipse cx="1350" cy="80" rx="300" ry="200" fill="url(#pageBgTopRightGlow)" filter="url(#pageBgSoftBlur)" />

        {/* Left outer ribbon blob — 3D curved folded fabric effect */}
        <path
          d="M 0 0
             C 180 40 420 200 380 440
             C 340 650 160 780 0 900
             Z"
          fill="url(#pageBgBlobOuter)"
        />

        {/* Left inner depth layer */}
        <path
          d="M 0 0
             C 100 60 280 240 240 470
             C 200 660 60 800 0 900
             Z"
          fill="url(#pageBgBlobInner)"
        />

        {/* Left edge caught-light highlight strip */}
        <path
          d="M 0 0
             C 40 100 80 280 60 480
             C 40 650 10 790 0 900
             L 0 0 Z"
          fill="url(#pageBgBlobEdge)"
          filter="url(#pageBgMedBlur)"
        />
      </svg>

      {/* ── AMBIENT GLOW ORBS ── */}
      <div className="absolute top-8 left-[18%] w-72 h-72 rounded-full bg-purple-300/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[12%] w-64 h-64 rounded-full bg-indigo-300/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-[5%] w-[500px] h-[380px] rounded-full bg-violet-300/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-purple-200/20 blur-3xl pointer-events-none" />

      {/* ── SPARKLE STARS (✦) ── */}
      <div className="absolute top-10 left-[22%] text-purple-500 font-bold text-base opacity-70 pointer-events-none">✦</div>
      <div className="absolute top-[45%] left-[8%] text-purple-400 font-bold text-xs opacity-60 pointer-events-none">✦</div>
      <div className="absolute top-24 right-[22%] text-purple-400 font-bold text-xs opacity-60 pointer-events-none">✦</div>
      <div className="absolute top-[55%] right-[10%] text-indigo-500 font-bold text-sm opacity-70 pointer-events-none">✦</div>
      <div className="absolute top-[30%] right-[28%] text-purple-300 font-bold text-[10px] opacity-50 pointer-events-none">✦</div>
      <div className="absolute bottom-20 left-[18%] text-purple-400 font-bold text-sm opacity-60 pointer-events-none">✦</div>
      <div className="absolute bottom-32 right-[18%] text-indigo-400 font-bold text-xs opacity-65 pointer-events-none">✦</div>
    </div>
  );
};
