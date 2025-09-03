import React, { useState, useEffect, useRef } from "react";

const NavigationComponent = ({ navigationSteps = [], pathData = null }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showRouteInfo, setShowRouteInfo] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speechSynthesisRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  const defaultSteps = [{ direction: "start", message: "Use the 'Find Your Route' section to plan your journey", angle: 0 }];

  const steps = navigationSteps.length > 0 ? navigationSteps : defaultSteps;
  const currentNav = steps[currentStep];
  const isDestination = currentStep === steps.length - 1 && steps[currentStep]?.direction === "destination";
  const isStart = currentStep === 0;
  const hasRouteData = pathData !== null;

  useEffect(() => {
    if ("speechSynthesis" in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (hasRouteData && currentNav?.message) {
      speakMessage(currentNav.message);
    }
  }, [currentStep, hasRouteData, currentNav?.message]);

  useEffect(() => {
    if (navigationSteps.length > 0) {
      setCurrentStep(0);
      setIsNavigating(false);
      setShowCongratulations(false);
      setShowRouteInfo(true);

      const timer = setTimeout(() => {
        setShowRouteInfo(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [navigationSteps]);

  const speakMessage = (message) => {
    // Cancel any ongoing speech
    if (speechSynthesisRef.current?.speaking) {
      speechSynthesisRef.current.cancel();
    }

    if (!speechSynthesisRef.current || !message) return;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    currentUtteranceRef.current = utterance;
    speechSynthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current?.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const getDirectionIcon = (direction) => {
    const icons = {
      start: "🎯",
      forward: "↑",
      backward: "↑",
      left: "↑",
      right: "↑",
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
    stopSpeaking();

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsNavigating(true);

      if (currentStep === steps.length - 2) {
        setTimeout(() => {
          setShowCongratulations(true);
        }, 500);
      }
    }
  };

  const handleReset = () => {
    stopSpeaking();
    setCurrentStep(0);
    setIsNavigating(false);
    setShowCongratulations(false);
  };

  const handleRepeatMessage = () => {
    if (currentNav?.message) {
      speakMessage(currentNav.message);
    }
  };

  const getButtonText = () => {
    if (isStart && !hasRouteData) return "Plan Your Route →";
    if (isStart && hasRouteData) return "Start Navigation";
    if (isDestination) return "Route Complete ✓";
    return "Next Step";
  };

  const getEstimatedInfo = () => {
    if (!pathData) return { stepsLeft: "?", time: "?", distance: "?" };

    const stepsLeft = steps.length - currentStep - 1;

    const totalTimeInMinutes = parseFloat(pathData.time) || 0;
    const timePerStep = totalTimeInMinutes / (steps.length - 1);
    const remainingTime = Math.max(0, totalTimeInMinutes - currentStep * timePerStep);

    const totalDistanceInMeters = parseInt(pathData.distance) || 0;
    const distancePerStep = totalDistanceInMeters / (steps.length - 1);
    const remainingDistance = Math.max(0, totalDistanceInMeters - currentStep * distancePerStep);

    return {
      stepsLeft,
      time: remainingTime > 0 ? `${remainingTime.toFixed(1)} min` : "0 min",
      distance: remainingDistance > 0 ? `${Math.round(remainingDistance)} m` : "0 m",
    };
  };

  const estimatedInfo = getEstimatedInfo();

  return (
    <div className="flex-1 p-4">
      <div
        className={`h-full rounded-3xl overflow-hidden relative shadow-2xl transition-all duration-1000 ${
          isDestination
            ? "bg-gradient-to-br from-emerald-400 to-green-500"
            : hasRouteData
            ? "bg-gradient-to-br from-green-600 to-lime-400"
            : "bg-gradient-to-br from-gray-600 to-lime-400"
        }`}
      >
        {showCongratulations && (
          <div
            className={`absolute top-0 left-0 right-0 backdrop-blur-lg p-6 transform translate-y-0 animate-bounce z-10 ${
              isDestination ? "bg-gradient-to-r from-emerald-300/90 to-green-400/90" : "bg-gradient-to-r from-green-300/90 to-lime-400/90"
            }`}
          >
            <p className="text-center text-white font-bold text-xl drop-shadow-lg">🎉 Congratulations on reaching your destination! 🎉</p>
          </div>
        )}

        {hasRouteData && showRouteInfo && !showCongratulations && (
          <div
            className="absolute top-0 left-0 right-0 bg-white/20 backdrop-blur-lg p-4 border-b border-white/30 z-10 transition-all duration-500 ease-out"
            style={{
              animation: "slideDown 0.5s ease-out",
            }}
          >
            <div className="text-center text-white">
              <div className="text-sm font-semibold">Route Information</div>
              <div className="text-xs">
                Total Distance: {pathData.distance} • Estimated Time: {pathData.time}
              </div>
            </div>
            <style jsx>{`
              @keyframes slideDown {
                from {
                  transform: translateY(-100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
            `}</style>
          </div>
        )}

        <div className={`absolute inset-0 flex items-center justify-center p-8 ${showRouteInfo ? "pt-20" : ""} transition-all duration-300`}>
          <div className="flex flex-col items-center space-y-6 h-full justify-center">
            <div className="relative">
              <div
                className={`w-48 h-48 rounded-full border-4 border-white/30 backdrop-blur-xl flex items-center justify-center transition-all duration-700 ${
                  isDestination ? "bg-white/20" : hasRouteData ? "bg-white/10" : "bg-white/5"
                } ${isNavigating ? "animate-pulse" : ""}`}
              >
                <div className="text-white">{getDirectionDisplay(currentNav.direction)}</div>

                <div className="absolute inset-0">
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-white/70 text-base font-bold">N</div>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 text-base font-bold">E</div>
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white/70 text-base font-bold">S</div>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 text-base font-bold">W</div>

                  <div className="absolute top-6 right-6 text-white/50 text-xs font-bold">↑UP</div>
                  <div className="absolute bottom-6 left-6 text-white/50 text-xs font-bold">↓DOWN</div>
                </div>

                {hasRouteData && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-white/10 animate-ping" style={{ animationDelay: "0.5s" }}></div>
                  </>
                )}
              </div>

              {hasRouteData && (
                <div className="absolute -top-4 -right-4 bg-white/30 backdrop-blur-lg rounded-full w-12 h-12 flex items-center justify-center text-white font-bold border-2 border-white/40 text-lg">
                  {currentStep + 1}
                </div>
              )}
            </div>

            <div className="flex space-x-4 text-white/90">
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20">
                <div className="text-xl font-bold">{estimatedInfo.stepsLeft}</div>
                <div className="text-xs font-semibold">Steps Left</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20">
                <div className="text-xl font-bold">{estimatedInfo.time}</div>
                <div className="text-xs font-semibold">Time</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20">
                <div className="text-xl font-bold">{estimatedInfo.distance}</div>
                <div className="text-xs font-semibold">Distance</div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30 transform hover:scale-105 transition-all duration-300 max-w-lg relative">
              {hasRouteData && (
                <button
                  onClick={handleRepeatMessage}
                  disabled={isSpeaking}
                  className="absolute -top-2 -right-2 bg-white/20 backdrop-blur-lg rounded-full p-2 border border-white/30 hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
                  title="Repeat message"
                >
                  <span className="text-white text-sm">🔊</span>
                </button>
              )}

              <div className="text-white text-lg font-semibold text-center leading-relaxed">
                {currentNav.message
                  .split(/[.\n]/)
                  .filter((sentence) => sentence.trim())
                  .map((sentence, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      {sentence.trim()}
                      {index < currentNav.message.split(/[.\n]/).filter((sentence) => sentence.trim()).length - 1 ? "." : ""}
                    </div>
                  ))}
              </div>

              {hasRouteData && (
                <>
                  <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-white to-white/80 rounded-full h-2 transition-all duration-500 shadow-lg"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>

                  <div className="mt-2 text-center text-white/80 text-sm">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={hasRouteData ? handleNext : undefined}
                disabled={(!hasRouteData && isStart) || isDestination}
                className={`px-8 py-3 rounded-2xl font-bold text-lg border-3 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
                  isDestination
                    ? "bg-white/30 text-white border-white/50 cursor-not-allowed opacity-75"
                    : !hasRouteData && isStart
                    ? "bg-white/10 text-white/70 border-white/30 cursor-not-allowed opacity-50"
                    : "bg-white/20 text-white border-white/40 backdrop-blur-lg hover:bg-white/30 hover:border-white/60 hover:-translate-y-1 hover:shadow-xl"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{getButtonText()}</span>
                  {hasRouteData && !isDestination && <span className="text-2xl">→</span>}
                </span>
              </button>

              {hasRouteData && currentStep > 0 && (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-2xl font-bold text-sm border-2 bg-white/10 text-white border-white/30 backdrop-blur-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  ↺ Reset
                </button>
              )}
            </div>
          </div>
        </div>

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
