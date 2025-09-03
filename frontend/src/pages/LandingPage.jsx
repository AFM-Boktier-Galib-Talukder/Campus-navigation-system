import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Zoro_image from "../assets/zoro_01.png";
import Typewriter from "../components/ImdadTypewriter";

const LandingPage = () => {
  const navigate = useNavigate();
  const summaryText = [
    "CampusNav is your ultimate navigation solution for college campuses. Find the shortest routes to your classes, discover hidden spots, and never be late again. Our app helps you navigate your campus with precision, saving you time and reducing stress.",
  ];

  useEffect(() => {
    // Initialize particles.js
    if (window.particlesJS) {
      window.particlesJS("particles-js", {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.3,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab",
            },
            onclick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1,
              },
            },
            push: {
              particles_nb: 4,
            },
          },
        },
        retina_detect: true,
      });
    }

    // Button pulse effect
    const btn = document.querySelector(".login-btn");
    const pulseInterval = setInterval(() => {
      if (btn) {
        btn.style.transform = "scale(1.02)";
        setTimeout(() => {
          btn.style.transform = "scale(1)";
        }, 500);
      }
    }, 3000);

    return () => {
      clearInterval(pulseInterval);
    };
  }, []);

  // Remaining inline styles for complex gradients and animations
  const remainingStyles = {
    particles: {
      position: "fixed",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      zIndex: 0,
    },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-800 to-lime-400 flex-col overflow-x-hidden relative font-['Poppins'] box-border">
      <style jsx>{`
        .gradient-header {
          background: linear-gradient(180deg, #fffff0, #ffe100);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4);
        }

        .button-shine:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(255, 140, 0, 0.4);
        }
      `}</style>

      <div id="particles-js" style={remainingStyles.particles}></div>

      <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between flex-1 z-10">
        <div className="w-64/100 content-left bg-wh">
          <span
            style={{ fontFamily: "'Inknut Antiqua', serif" }}
            class="text-[3rem] font-extrabold mb-6 relative inline-block px-5 bg-gradient-to-r from-yellow-400 to-lime-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_white] animate-[pulse_4s_ease-in-out_infinite]"
          >
            Never Lost on Campus, Use Campus-Nav
          </span>

          <div className="p-4">
            <p  className="text-yellow-200 text-lg font-medium">
              <Typewriter messages={summaryText} speed={40} pauseMs={8000} className="text-yellow-200 text-lg font-medium" random />
            </p>
          </div>
          <button
            style={{ fontFamily: "'Inknut Antiqua', serif" }}
            onClick={() => navigate("/signup")}
            className="w-full text-yellow-200 cursor-pointer bg-gradient-to-r from-lime-400 to-green-600 text-2xl font-extrabold py-2 px-4 rounded-md hover:from-green-600 hover:to-lime-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 relative overflow-hidden group button-shine"
          >
            <i className="fas fa-sign-in-alt"></i> Explore
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-3000 ease-out"></div>
          </button>
        </div>

        <img src={Zoro_image} alt="Zoro from One Piece" className="w-36/100 relative left-17 content-right" />
      </div>
    </div>
  );
};

export default LandingPage;
