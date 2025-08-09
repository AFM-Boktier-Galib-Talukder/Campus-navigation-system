import React, { useState } from "react";

const NavigationComponent = ({ navigationSteps = [] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  // Default steps if no steps provided
  const defaultSteps = [
    { direction: "start", message: "Ready to begin your journey", angle: 0 },
    { direction: "forward", message: "Walk straight for 100 meters", angle: 0 },
    { direction: "right", message: "Turn right towards the library", angle: 90 },
    { direction: "forward", message: "Continue straight for 50 meters", angle: 0 },
    { direction: "left", message: "Turn left at the fountain", angle: -90 },
    { direction: "up", message: "Go to the second floor", angle: 0 },
    { direction: "destination", message: "You have reached your destination!", angle: 0 },
  ];

  const steps = navigationSteps.length > 0 ? navigationSteps : defaultSteps;
  const currentNav = steps[currentStep];
  const isDestination = currentStep === steps.length - 1;
  const isStart = currentStep === 0;

  const getDirectionIcon = (direction) => {
    const icons = {
      start: "🎯",
      forward: "↑",
      backward: "↓",
      left: "←",
      right: "→",
      up: "⇡",
      down: "⇣",
      destination: "🏁",
    };
    return icons[direction] || "▲";
  };

  const getDirectionDisplay = (direction) => {
    if (direction === "up") {
      return (
        <div className="flex flex-col items-center">
          <div className="text-4xl animate-bounce">⇡</div>
          <div className="text-2xl">UP</div>
        </div>
      );
    }
    if (direction === "down") {
      return (
        <div className="flex flex-col items-center">
          <div className="text-4xl">DOWN</div>
          <div className="text-2xl animate-bounce">⇣</div>
        </div>
      );
    }
    return (
      <div
        className="text-6xl transform transition-transform duration-700 ease-in-out"
        style={{
          transform: `rotate(${currentNav.angle}deg)`,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
        }}
      >
        {getDirectionIcon(direction)}
      </div>
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsNavigating(true);

      // Show congratulations when reaching destination
      if (currentStep === steps.length - 2) {
        setTimeout(() => {
          setShowCongratulations(true);
        }, 500);
      }
    }
  };

  const getButtonText = () => {
    if (isStart) return "Get Started";
    if (isDestination) return "Final Destination";
    return "Next";
  };

  return (
    <div className="flex-1 p-5 max-h-10/12">
      {/* Navigation Container - Matching FindRouteSection Height */}
      <div
        className={`h-full rounded-3xl overflow-hidden relative shadow-2xl transition-all duration-1000 ${
          isDestination ? "bg-gradient-to-br from-emerald-400 to-green-500" : "bg-gradient-to-br from-orange-400 to-yellow-400"
        }`}
      >
        {/* Congratulations Banner */}
        {showCongratulations && (
          <div
            className={`absolute top-0 left-0 right-0 backdrop-blur-lg p-6 transform translate-y-0 animate-bounce z-10 ${
              isDestination ? "bg-gradient-to-r from-emerald-300/90 to-green-400/90" : "bg-gradient-to-r from-orange-300/90 to-yellow-400/90"
            }`}
          >
            <p className="text-center text-white font-bold text-xl drop-shadow-lg">🎉 Congratulations on reaching your destination! 🎉</p>
          </div>
        )}

        {/* Main Navigation Content */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="flex flex-col items-center space-y-6 h-full justify-center">
            {/* Compass Circle */}
            <div className="relative">
              <div
                className={`w-48 h-48 rounded-full border-4 border-white/30 backdrop-blur-xl flex items-center justify-center transition-all duration-700 ${
                  isDestination ? "bg-white/20" : "bg-white/10"
                } ${isNavigating ? "animate-pulse" : ""}`}
              >
                {/* Direction Display */}
                <div className="text-white">{getDirectionDisplay(currentNav.direction)}</div>

                {/* Enhanced Compass Points */}
                <div className="absolute inset-0">
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-white/70 text-base font-bold">N</div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 text-base font-bold">E</div>
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white/70 text-base font-bold">S</div>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 text-base font-bold">W</div>

                  {/* Up/Down indicators */}
                  <div className="absolute top-6 right-6 text-white/50 text-xs font-bold">↑UP</div>
                  <div className="absolute bottom-6 left-6 text-white/50 text-xs font-bold">↓DOWN</div>
                </div>

                {/* Multiple Pulsing Rings */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-2 border-white/10 animate-ping" style={{ animationDelay: "0.5s" }}></div>
              </div>

              {/* Step Counter */}
              <div className="absolute -top-4 -right-4 bg-white/30 backdrop-blur-lg rounded-full w-12 h-12 flex items-center justify-center text-white font-bold border-2 border-white/40 text-lg">
                {currentStep + 1}
              </div>
            </div>

            {/* Additional Info - Moved above message */}
            <div className="flex space-x-4 text-white/90">
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20">
                <div className="text-xl font-bold">{steps.length - currentStep - 1}</div>
                <div className="text-xs font-semibold">Steps Left</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20">
                <div className="text-xl font-bold">~{(steps.length - currentStep) * 2}</div>
                <div className="text-xs font-semibold">Minutes</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20">
                <div className="text-xl font-bold">{(steps.length - currentStep) * 50}m</div>
                <div className="text-xs font-semibold">Distance</div>
              </div>
            </div>

            {/* Direction Message Box */}
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 transform hover:scale-105 transition-all duration-300 max-w-lg">
              <p className="text-white text-lg font-semibold text-center leading-relaxed">{currentNav.message}</p>

              {/* Enhanced Progress Bar */}
              <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-white to-white/80 rounded-full h-2 transition-all duration-500 shadow-lg"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>

              {/* Progress Text */}
              <div className="mt-2 text-center text-white/80 text-sm">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleNext}
              disabled={isDestination}
              className={`px-8 py-3 rounded-2xl font-bold text-lg border-3 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                isDestination
                  ? "bg-white/30 text-white border-white/50 cursor-not-allowed opacity-75"
                  : "bg-white/20 text-white border-white/40 backdrop-blur-lg hover:bg-white/30 hover:border-white/60 hover:-translate-y-1 hover:shadow-xl"
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>{getButtonText()}</span>
                {!isDestination && <span className="text-2xl">→</span>}
              </span>
            </button>
          </div>
        </div>

        {/* Enhanced Decorative Elements */}
        <div className="absolute top-4 right-4 text-white/20 text-6xl animate-spin" style={{ animationDuration: "10s" }}>
          ⚙️
        </div>
        <div className="absolute bottom-4 left-4 text-white/20 text-6xl animate-bounce">📍</div>
        <div className="absolute top-20 left-16 text-white/10 text-8xl rotate-45 animate-pulse">🗺️</div>
        <div className="absolute bottom-20 right-16 text-white/10 text-8xl animate-pulse" style={{ animationDelay: "1s" }}>
          🧭
        </div>
      </div>
    </div>
  );
};

export default NavigationComponent;
