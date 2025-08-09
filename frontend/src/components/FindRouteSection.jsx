import React, { useState } from "react";

function FindRouteSection() {
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [transportOption, setTransportOption] = useState("Lift");

  const handleFindRoute = () => {
    if (!startPoint || !endPoint) {
      alert('Please enter both start and end points');
      return;
    }
    
    console.log('Route search:', {
      start: startPoint,
      end: endPoint,
      transport: transportOption
    });
    
    // This would typically call the navigation API
    alert(`Finding route from ${startPoint} to ${endPoint} via ${transportOption}`);
  };

  const transportOptions = [
    { 
      id: "lift", 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ), 
      label: "Lift" 
    },
    { 
      id: "stairs", 
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ), 
      label: "Stairs" 
    }
  ];

  return (
    <div className="w-96 p-8 border-l border-orange-200/30 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-orange-200/50 sticky top-8">
        {/* Section Header */}
        <div className="p-6 border-b border-orange-200/30 bg-gradient-to-r from-orange-50/50 to-yellow-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-yellow-400 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Find Your Route</h3>
          </div>
          <p className="text-gray-600 text-sm">Plan your navigation across campus</p>
        </div>

        {/* Route Search Form */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Start Point */}
            <div>
              <label htmlFor="start-point" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Start Point
              </label>
              <input
                type="text"
                id="start-point"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm bg-white/80 backdrop-blur-sm"
                placeholder="Current location or select..."
              />
            </div>

            {/* End Point */}
            <div>
              <label htmlFor="end-point" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Destination
              </label>
              <input
                type="text"
                id="end-point"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm bg-white/80 backdrop-blur-sm"
                placeholder="Search for building, room, or facility..."
              />
            </div>

            {/* Transport Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Transport Options
              </label>
              <div className="flex gap-3">
                {transportOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setTransportOption(option.label)}
                    className={`flex-1 text-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      transportOption === option.label
                        ? 'bg-gradient-to-br from-red-400 to-yellow-400 border-orange-500 text-white shadow-lg transform scale-105'
                        : 'border-orange-300 hover:border-orange-400 hover:bg-orange-50 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className={`w-8 h-8 flex items-center justify-center ${
                        transportOption === option.label ? 'text-white' : 'text-orange-500'
                      }`}>
                        {option.icon}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      transportOption === option.label ? 'text-white' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Find Route Button */}
            <button
              onClick={handleFindRoute}
              className="w-full bg-gradient-to-br from-red-400 to-yellow-400 text-white py-4 px-6 rounded-xl font-semibold text-base hover:from-red-500 hover:to-yellow-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-orange-300"
            >
              Find Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindRouteSection;
