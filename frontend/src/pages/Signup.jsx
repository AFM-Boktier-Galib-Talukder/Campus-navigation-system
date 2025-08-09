import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import welcomeBoy from "../assets/welcomeBoyL.png";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
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
    setMessage("");

    try {
      const response = await axios.post("http://localhost:1490/api/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        setIsSuccess(true);
        setMessage("You are now registered. Please go to the login page to sign in.");

        //Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      setIsSuccess(false);
      if (error.response) {
        setMessage(error.response.data.error || "Registration failed");
      } else if (error.request) {
        setMessage("No response from server. Please try again.");
      } else {
        setMessage("Error: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen max-h-lvh flex flex-col md:flex-row bg-orange-300 text-white overflow-hidden relative">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-orange-500 rounded-r-full flex items-center justify-center p-8" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
        <div className="w-full max-w-md ">
          <h1
            className="relative bottom-4 text-5xl font-bold text-center mb-2"
            style={{
              fontFamily: "'Inknut Antiqua', serif",
            }}
          >
            Sign up
          </h1>
          <p className="text-center mb-6">Hey, Enter your details to create your account</p>

          {message && (
            <div className={`mb-4 p-3 rounded-md ${isSuccess ? "bg-green-500" : "bg-red-500"}`}>
              {message}
              {isSuccess && (
                <button onClick={() => navigate("/login")} className="ml-2 underline font-bold">
                  Go to Login
                </button>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="font-medium block text-sm mb-1">
                User Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-3 focus:ring-orange-200 text-gray-800"
                placeholder="Enter your username"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-3 focus:ring-orange-200 text-gray-800"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-3 focus:ring-orange-200 text-gray-800"
                placeholder="Enter your password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full text-orange-600 bg-white text-xl font-extrabold py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 relative overflow-hidden group"
            >
              Sign up
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>
        </div>
      </div>
      {/* Right Side - Content with Floating Particles */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-2 text-center relative" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
        <div className="relative top-20 flex items-center space-x-2 z-20">
          <p className="text-lg">Already have an account?</p>
          <button onClick={() => navigate("/login")} className="text-orange-500 font-bold hover:underline" style={{ fontFamily: "'Inknut Antiqua', serif" }}>
            Login
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

        @keyframes text-shimmer {
          0% {
            background-position: 100% center;
          }
          100% {
            background-position: 0% center;
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

        .animate-text-shimmer {
          animation: text-shimmer 3s linear infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
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

        /* Button shine effect */
        .group:hover .group-hover:translate-x-full {
          transform: translateX(100%);
        }
      `}</style>
    </div>
  );
};

export default SignUp;
