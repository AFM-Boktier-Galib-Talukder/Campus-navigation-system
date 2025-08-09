import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import welcomeBoy from "../assets/welcomeBoyR.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const loginResponse = await axios.post("http://localhost:1490/api/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (loginResponse.data.status === "Success") {
        // Redirect based on role
        if (loginResponse.data.role === "admin") {
          navigate("/admin-dashboard", { state: { userId: loginResponse.data.userId } });
        } else {
          navigate("/homepage", { state: { userId: loginResponse.data.userId } });
        }
      } else {
        setMessage(loginResponse.data);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data || "An error occurred during login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-h-lvh flex flex-col md:flex-row bg-yellow-500/65 text-yellow-200 overflow-hidden relative">
      {/* Left Side - Content with Floating Particles */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-2 text-center relative" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
        <div className="relative top-20 flex items-center space-x-2 z-20">
          <p className="text-xl text-yellow-100">Don't have an account?</p>
          <button
            onClick={() => navigate("/signup")}
            className="text-orange-500/80  text-xl font-bold underline hover:text-2xl"
            style={{ fontFamily: "'Inknut Antiqua', serif" }}
          >
            Sign up
          </button>
        </div>

        {/* Particles Container */}
        <div className="relative w-full h-lvh">
          {/* Floating Particles */}
          <div className="absolute top-[20%] left-[15%] w-18 h-18 bg-orange-600/60 rounded-full animate-float-1"></div>
          <div className="absolute top-[30%] right-[25%] w-25 h-25 bg-orange-600/50 rounded-full animate-float-2 animation-delay-700"></div>
          <div className="absolute bottom-[5%] right-[55%] w-30 h-30 bg-orange-600/30 rounded-full animate-float-2 animation-delay-600"></div>
          <div className="absolute bottom-[25%] right-[10%] w-40 h-40 bg-orange-600/40 rounded-full animate-float-3 animation-delay-500"></div>
          <div className="absolute bottom-[35%] left-[20%] w-40 h-40 bg-orange-600/40 rounded-full animate-float-4 animation-delay-400"></div>
          <div className="absolute top-[15%] right-[20%] w-18 h-18 bg-orange-600/60 rounded-full animate-float-2 animation-delay-200"></div>
          <div className="absolute bottom-[40%] left-[0%] w-20 h-20 bg-orange-600/30 rounded-full animate-float-1 animation-delay-300"></div>
          {/* Main Image */}
          <img src={welcomeBoy} alt="Welcome illustration" className="relative top-20 w-full h-full object-cover z-10" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div
        className="w-full md:w-1/2 bg-orange-500 rounded-l-full flex items-center justify-center p-8 relative overflow-hidden form-container"
        style={{ fontFamily: "'Inria Sans', sans-serif" }}
      >
        <div className="w-full max-w-md">
          <h1
            className="relative bottom-4 text-5xl font-bold text-center mb-2 gradient-header"
            style={{
              fontFamily: "'Inknut Antiqua', serif",
            }}
          >
            Log in
          </h1>
          <p className="text-center mb-6 typing-animation">Hey, Enter your details to login to your account</p>

          {message && <div className={`mb-4 p-3 rounded-md ${message.includes("Success") ? "bg-green-500" : "bg-red-500"}`}>{message}</div>}

          <form className="space-y-4 mt-10" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="font-bold block text-lg mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="font-bold block text-lg mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white"
                  placeholder="Enter your password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-300 hover:text-white focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-yellow-200 text-2xl font-extrabold py-2 px-4 rounded-md hover:from-yellow-400 hover:to-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 relative overflow-hidden group button-shine glowing-text"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center glowing-text">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Login"
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-3000 ease-out"></div>
            </button>
          </form>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes float-1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -30px) rotate(90deg);
          }
          50% {
            transform: translate(40px, 0px) rotate(180deg);
          }
          75% {
            transform: translate(20px, 30px) rotate(270deg);
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-30px, -20px) rotate(-90deg);
          }
          50% {
            transform: translate(0px, -40px) rotate(-180deg);
          }
          75% {
            transform: translate(30px, -20px) rotate(-270deg);
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(15px, -25px) rotate(45deg);
          }
          50% {
            transform: translate(30px, 0px) rotate(90deg);
          }
          75% {
            transform: translate(15px, 25px) rotate(135deg);
          }
        }

        @keyframes float-4 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-25px, -15px) rotate(-45deg);
          }
          50% {
            transform: translate(0px, -30px) rotate(-90deg);
          }
          75% {
            transform: translate(25px, -15px) rotate(-135deg);
          }
        }

        @keyframes typing {
          0% {
            width: 0;
          }
          50% {
            width: 100%;
          }
          100% {
            width: 0;
          }
        }

        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: white;
          }
        }

        @keyframes form-shine {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(150%);
          }
        }

        @keyframes text-glow {
          0%,
          100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
          }
          50% {
            text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 45px rgba(255, 255, 255, 0.6);
          }
        }

        .animate-float-1 {
          animation: float-1 12s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 15s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 14s ease-in-out infinite;
        }

        .animate-float-4 {
          animation: float-4 13s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        /* Header with white glow */
        .gradient-header {
          background: linear-gradient(180deg, #fffff0, #ffe100);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4);
        }

        /* Typing Animation */
        .typing-animation {
          overflow: hidden;
          border-right: 3px solid white;
          white-space: nowrap;
          margin: 0 auto;
          letter-spacing: 0.05em;
          animation: typing 7.5s ease-in-out infinite, blink-caret 0.75s step-end infinite;
        }

        /* Enhanced Button Shine Effect */
        .button-shine:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(255, 140, 0, 0.4);
        }

        /* Glowing Button Text */
        .glowing-text {
          color: #ffffff;
          animation: text-glow 2s ease-in-out infinite;
        }

        .glowing-text:hover {
          color: #ffffff;
        }

        /* Form Container Shine Effect */
        .form-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          width: 150%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), rgba(255, 140, 0, 0.3), transparent);
          animation: form-shine 10s ease-out infinite;
          z-index: 1;
        }

        .form-container > div {
          position: relative;
          z-index: 2;
        }

        /* Button shine effect */
        .group:hover .group-hover:translate-x-full {
          transform: translateX(100%);
        }
      `}</style>
    </div>
  );
};

export default Login;
