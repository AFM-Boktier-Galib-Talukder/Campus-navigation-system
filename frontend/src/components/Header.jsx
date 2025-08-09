import React from "react";
import TypewriterText from "./TypewriterText";

function Header({ userData }) {
  return (
    <header className="header-container bg-gradient-to-br from-orange-600 to-yellow-400 flex justify-between items-center p-8 backdrop-blur-xl border-b border-orange-200/30 shadow-lg relative">
      <div className="flex-1 z-10">
        <h1
          className="gradient-header relative text-4xl font-bold font-inknut  bg-clip-text text-transparent"
          style={{ fontFamily: "'Inknut Antiqua', serif" }}
        >
          Welcome to BRACU-NAV
        </h1>
        <p className="mt-2">
          <TypewriterText text="Your intelligent campus navigation companion" speed={50} className="text-yellow-200 text-lg font-medium" />
        </p>
      </div>

      {/* User Profile */}
      <div className="flex items-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl border border-orange-200/50 shadow-lg z-10">
        <div className="w-11 h-11 bg-gradient-to-br from-red-400 to-yellow-400 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div>
          <div className="text-orange-500 font-bold">{userData?.name || "User"}</div>
          <div className="text-orange-400/90 text-sm">{userData?.email || "user@example.com"}</div>
        </div>
      </div>

      <style jsx>{`
        /* Header Container Shine Effect */
        .header-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          width: 150%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), rgba(255, 140, 0, 0.3), transparent);
          animation: shine 8s ease-out infinite;
          z-index: 1;
        }

        /* Header with white glow */
        .gradient-header {
          background: linear-gradient(180deg, #fffff0, #ffe100);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4);
        }

        @keyframes shine {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(150%);
          }
        }
      `}</style>
    </header>
  );
}

export default Header;

//bg-gradient-to-r from-red-400 to-yellow-400
