import React from "react";
import welcomeBoy from "./assets/welcomeBoyL.png";

const SignUp = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-orange-300 text-white">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-orange-500 rounded-r-full flex items-center justify-center p-8" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
        <div className="w-full max-w-md">
          <h1 className="relative bottom-4 text-5xl font-bold text-center mb-2" style={{ fontFamily: "'Inknut Antiqua', serif" }}>
            Sign up
          </h1>
          <p className="text-center mb-6">Hey, Enter your details to create your account</p>

          <form className="space-y-4">
            <div>
              <label htmlFor="username" className="font-medium block text-sm mb-1">
                User Name
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-3 foc"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-3"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-3"
                placeholder="Enter your password"
                required
                minLength="6"
              />
            </div>

            <button
              type="submit"
              className="w-full text-orange-600 text- bg-white text-xl font-extrabold py-2 px-4 rounded-md hover:bg-orange-600 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-2 text-center" style={{ fontFamily: "'Inria Sans', sans-serif" }}>
        <div className="relative top-20 flex space-x-2">
          <p className="text-lg mb-8">Already have an account ? </p>
          <a href="" className="text-orange-500 z-10 font-bold hover:underline" style={{ fontFamily: "'Inknut Antiqua', serif" }}>
            Login
          </a>
        </div>
        <img src={welcomeBoy} alt="Welcome illustration" className="relative top-3 w-full h-lvh object-cover" />
      </div>
    </div>
  );
};

export default SignUp;
