import React, { useMemo } from "react";
import ImdadTypewriter from "./ImdadTypewriter";

function Header({ userData, title }) {
  const slogans = useMemo(() => ([
    "Navigate BRAC like a pro.",
    "Your campus, your compass.",
    "Find your way, the BRAC way.",
    "Where every path leads to learning.",
    "From classroom to café — we’ve got you.",
    "Discover BRAC, step by step.",
    "Campus life, simplified.",
    "Your guide to every corner of BRAC.",
    "Explore. Learn. Belong.",
    "Never lost, always learning.",
  ]), []);

  // Rotation is handled by ImdadTypewriter

  return (
    <header className="flex justify-between items-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50 backdrop-blur-xl border-b border-orange-200/30 shadow-lg">
      <div className="flex-1">
        <h1 className="text-4xl font-bold font-inknut bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
          {title || 'Welcome to BRAC-NAV'}
        </h1>
        <p className="text-gray-600 text-lg font-medium">
          <ImdadTypewriter
            messages={slogans}
            speed={120}
            pauseMs={4000}
            className="text-gray-600 text-lg font-medium"
            random
          />
        </p>
      </div>
      
      {/* User Profile */}
      <div className="flex items-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl border border-orange-200/50 shadow-lg">
        <div className="w-11 h-11 bg-gradient-to-br from-red-400 to-yellow-400 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div>
          <div className="text-gray-800 font-bold">{userData?.name || 'User'}</div>
          <div className="text-gray-500 text-sm">{userData?.email || 'user@example.com'}</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
