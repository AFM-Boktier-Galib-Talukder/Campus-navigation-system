import React, { useMemo } from "react";
import ImdadTypewriter from "./ImdadTypewriter";
import { useNavigate } from "react-router-dom";

function Header({ userData, title }) {
  const navigate = useNavigate();
  const slogans = useMemo(
    () => [
      "Navigate CAMPUS like a pro.",
      "Your campus, your compass.",
      "Find your way, the CAMPUS way.",
      "Where every path leads to learning.",
      "From classroom to café — we’ve got you.",
      "Discover CAMPUS, step by step.",
      "Campus life, simplified.",
      "Your guide to every corner of CAMPUS.",
      "Explore. Learn. Belong.",
      "Never lost, always learning.",
    ],
    []
  );

  // Rotation is handled by ImdadTypewriter

  return (
    <header className="header-container bg-gradient-to-r from-green-700 to-lime-400 flex justify-between items-center p-8 backdrop-blur-xl border-b border-green-200/30 shadow-lg relative">
      <div className="flex-1 z-10">
        <h1
          className="gradient-header relative text-4xl font-bold font-inknut  bg-clip-text text-transparent"
          style={{ fontFamily: "'Inknut Antiqua', serif" }}
        >
          {title || "Welcome to Campus-NAV"}
        </h1>
        <p className="text-yellow-200 text-lg font-medium">
          <ImdadTypewriter messages={slogans} speed={120} pauseMs={4000} className="text-lime-200 text-lg font-medium" random />
        </p>
      </div>

      {/* User Profile */}
      <div className="flex items-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl border border-green-200/50 shadow-lg z-10">
        <div className="w-11 h-11 bg-gradient-to-br from-green-600 to-lime-300 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div>
          <div className="text-green-500 font-bold">{userData?.name || "User"}</div>
          <div className="text-lime-400/90 text-sm">{userData?.email || "user@example.com"}</div>
        </div>
      </div>
      <button
        onClick={() => navigate("/login")}
        className="text-white bg-gradient-to-br from-green-600 to-lime-300 backdrop-blur-sm m-4 pt-6 pr-4 pl-4 items-center pb-6 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl border-2 border-white shadow-lg z-10"
      >
        <i className="fas fa-sign-in-alt"></i>
      </button>

      <style jsx>{`
        /* Header Container Shine Effect */
        .header-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          width: 150%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgb(32, 182, 2), rgb(123, 228, 130), transparent);
          animation: shine 8s ease-out infinite;
          z-index: 1;
        }

        /* Header with white glow */
        .gradient-header {
          background: linear-gradient(180deg, #20b602, #fbff00);
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
