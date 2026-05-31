import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
}

export default function Logo({ className = "w-10 h-10", variant = "color" }: LogoProps) {
  // Determine colors based on the requested variant
  const strokeColor = variant === 'light' ? '#ffffff' : '#1b4332';
  const textColorPrimary = variant === 'light' ? '#ffffff' : '#0b3c1b';
  const textColorSecondary = variant === 'light' ? '#e2e8f0' : '#2d6a4f';
  const sunStroke = variant === 'light' ? '#ffffff' : '#f39c12';
  const sunFill = "url(#sun-gradient)";
  const wheatFill = variant === 'light' ? '#ffffff' : '#2d6a4f';
  const hill1 = variant === 'light' ? '#ffffff' : '#3f7a4c';
  const hill2 = variant === 'light' ? '#ffffff' : '#2d6a4f';
  const hill3 = variant === 'light' ? '#ffffff' : '#1b4332';

  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circle (left and bottom sides) */}
      <path 
        d="M 86 28 A 48 48 0 1 0 88 90" 
        stroke={strokeColor} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Sun in the upper half */}
      <path 
        d="M 42 54 A 18 18 0 0 1 78 54 Z" 
        fill={variant === 'light' ? '#ffffff' : sunFill} 
      />
      
      {/* Sun Rays */}
      <g stroke={sunStroke} strokeWidth="2.5" strokeLinecap="round" opacity={variant === 'light' ? 0.7 : 1}>
        <line x1="60" y1="32" x2="60" y2="24" />
        <line x1="48" y1="37" x2="42" y2="31" />
        <line x1="72" y1="37" x2="78" y2="31" />
        <line x1="40" y1="48" x2="33" y2="45" />
        <line x1="80" y1="48" x2="87" y2="45" />
        {/* Additional shorter rays */}
        {variant !== 'light' && (
          <>
            <line x1="53" y1="34" x2="50" y2="28" stroke="#f1c40f" strokeWidth="2" />
            <line x1="67" y1="34" x2="70" y2="28" stroke="#f1c40f" strokeWidth="2" />
            <line x1="43" y1="42" x2="37" y2="38" stroke="#f1c40f" strokeWidth="2" />
            <line x1="77" y1="42" x2="83" y2="38" stroke="#f1c40f" strokeWidth="2" />
          </>
        )}
      </g>

      {/* Rolling Hills / Green Fields at the bottom */}
      <g opacity={variant === 'light' ? 0.8 : 1}>
        {/* Back Hill */}
        <path 
          d="M 20 84 C 45 72, 75 85, 98 84 L 98 104 C 70 104, 40 104, 20 104 Z" 
          fill={hill1} 
        />
        {/* Middle Hill */}
        <path 
          d="M 16 90 C 45 78, 70 92, 98 92 L 98 104 C 70 104, 40 104, 16 104 Z" 
          fill={hill2} 
        />
        {/* Front Hill */}
        <path 
          d="M 22 96 C 50 82, 80 94, 98 94 L 98 104 C 80 104, 45 104, 22 104 Z" 
          fill={hill3} 
        />
        {/* White Accent Lines on Hills */}
        {variant !== 'light' && (
          <>
            <path 
              d="M 30 96 C 50 86, 75 95, 90 95" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              fill="none" 
              opacity="0.3"
            />
            <path 
              d="M 20 90 C 45 80, 65 91, 80 91" 
              stroke="white" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              fill="none" 
              opacity="0.2"
            />
          </>
        )}
      </g>

      {/* Wheat Stalk on the Right (forms part of the border) */}
      <g fill={wheatFill}>
        {/* Stem */}
        <path 
          d="M 84 22 C 86 32, 88 75, 86 92" 
          stroke={wheatFill} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          fill="none" 
        />
        {/* Grains / Leaves along the stem */}
        {/* Top single grain */}
        <path d="M 79 16 C 81 12, 84 13, 84 17 C 84 21, 80 20, 79 16 Z" />
        {/* Left/Right pairs going down */}
        <path d="M 76 25 C 71 23, 72 27, 75 29 C 78 31, 79 28, 76 25 Z" />
        <path d="M 88 23 C 93 21, 94 25, 91 27 C 88 29, 87 26, 88 23 Z" />
        
        <path d="M 77 35 C 72 33, 73 37, 76 39 C 79 41, 80 38, 77 35 Z" />
        <path d="M 89 32 C 94 30, 95 34, 92 36 C 89 38, 88 35, 89 32 Z" />

        <path d="M 79 45 C 74 43, 75 47, 78 49 C 81 51, 82 48, 79 45 Z" />
        <path d="M 90 42 C 95 40, 96 44, 93 46 C 90 48, 89 45, 90 42 Z" />

        <path d="M 80 55 C 75 53, 76 57, 79 59 C 82 61, 83 58, 80 55 Z" />
        <path d="M 91 52 C 96 50, 97 54, 94 56 C 91 58, 90 55, 91 52 Z" />

        <path d="M 81 65 C 76 63, 77 67, 80 69 C 83 71, 84 68, 81 65 Z" />
        <path d="M 92 62 C 97 60, 98 64, 95 66 C 92 68, 91 65, 92 62 Z" />

        <path d="M 81 75 C 76 73, 77 77, 80 79 C 83 81, 84 78, 81 75 Z" />
        <path d="M 92 72 C 97 70, 98 74, 95 76 C 92 78, 91 75, 92 72 Z" />
      </g>

      {/* Text "KISHAN SEVA" in the middle */}
      <text 
        x="56" 
        y="68" 
        textAnchor="middle" 
        fill={textColorPrimary} 
        fontSize="12.5" 
        fontWeight="900" 
        fontFamily="'Inter', 'Outfit', 'Helvetica Neue', sans-serif"
        letterSpacing="0.5"
      >
        KISHAN
      </text>
      <text 
        x="56" 
        y="80" 
        textAnchor="middle" 
        fill={textColorSecondary} 
        fontSize="12" 
        fontWeight="800" 
        fontFamily="'Inter', 'Outfit', 'Helvetica Neue', sans-serif"
        letterSpacing="0.5"
      >
        SEVA
      </text>

      {/* Gradients */}
      {variant !== 'light' && (
        <defs>
          <radialGradient id="sun-gradient" cx="60%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#ffeb3b" />
            <stop offset="70%" stopColor="#f39c12" />
            <stop offset="100%" stopColor="#d35400" />
          </radialGradient>
        </defs>
      )}
    </svg>
  );
}
