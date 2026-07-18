import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const UniversityLogo: React.FC<LogoProps> = ({ className = "", size = 80 }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md animate-fade-in"
      >
        {/* Outer Hexagon with double gold rings */}
        <path
          d="M100 10 L178 55 L178 145 L100 190 L22 145 L22 55 Z"
          fill="#065F46" /* Emerald Green base */
          stroke="#D97706" /* Golden/Amber stroke */
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M100 20 L169 60 L169 140 L100 180 L31 140 L31 60 Z"
          fill="none"
          stroke="#F59E0B" /* Bright Gold */
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Sana'a old city skyscraper / gate motif */}
        <path
          d="M60 130 V90 H75 V70 H125 V90 H140 V130 Z"
          fill="#111827"
          opacity="0.15"
        />
        <path
          d="M65 130 L65 95 L80 95 L80 75 L120 75 L120 95 L135 95 L135 130 Z"
          fill="#FFFDF5"
          stroke="#D97706"
          strokeWidth="3"
        />

        {/* Old Sana'a windows (Qamariyah style arches) */}
        <path d="M90 85 Q100 72 110 85 Z" fill="#D97706" />
        <circle cx="100" cy="102" r="6" fill="#059669" />
        
        {/* Open Book of Knowledge */}
        <path
          d="M100 135 C85 125 55 125 45 135 V155 C55 145 85 145 100 155 C115 145 145 145 155 155 V135 C145 125 115 125 100 135 Z"
          fill="#FFFFFF"
          stroke="#D97706"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <line x1="100" y1="135" x2="100" y2="155" stroke="#D97706" strokeWidth="2" />
        
        {/* Subtle rays of light */}
        <line x1="100" y1="30" x2="100" y2="50" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="55" x2="65" y2="65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <line x1="150" y1="55" x2="135" y2="65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        
        {/* Elegant Arabic Calligraphy / Text Representation inside the Ring */}
        <circle cx="100" cy="100" r="82" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="4 4" />
      </svg>
    </div>
  );
};
