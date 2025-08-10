import React, { useEffect, useState } from "react";

function FindRouteSection({ onPathFound }) {
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [transportOption, setTransportOption] = useState("lift");

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [startNoResults, setStartNoResults] = useState(false);
  const [endNoResults, setEndNoResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStartDot, setSelectedStartDot] = useState(null);
  const [selectedEndDot, setSelectedEndDot] = useState(null);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);

  const API_BASE = "http://localhost:1490/api/floor";

  async function fetchSuggestions(query) {
    const url = `${API_BASE}/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    return data.results || [];
  }

  // Debounced search for start input
  useEffect(() => {
    if (!showStartDropdown) return;
    const q = startPoint.trim();
    if (!q) {
      setStartSuggestions([]);
      setStartNoResults(false);
      setSelectedStartDot(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(q);
        setStartSuggestions(results);
        setStartNoResults(results.length === 0);
      } catch (_) {
        setStartSuggestions([]);
        setStartNoResults(true);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [startPoint, showStartDropdown]);

  // Debounced search for end input
  useEffect(() => {
    if (!showEndDropdown) return;
    const q = endPoint.trim();
    if (!q) {
      setEndSuggestions([]);
      setEndNoResults(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(q);
        setEndSuggestions(results);
        setEndNoResults(results.length === 0);
      } catch (_) {
        setEndSuggestions([]);
        setEndNoResults(true);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [endPoint, showEndDropdown]);

  const handleSelectStart = (label, dot) => {
    setStartPoint(label);
    setSelectedStartDot(dot);
    setStartSuggestions([]);
    setStartNoResults(false);
    setShowStartDropdown(false);
  };

  const handleSelectEnd = (label, dot) => {
    setEndPoint(label);
    setSelectedEndDot(dot);
    setEndSuggestions([]);
    setEndNoResults(false);
    setShowEndDropdown(false);
  };

  const handleFindRoute = async (e) => {
    e?.preventDefault();
    if (!startPoint.trim() || !endPoint.trim() || !transportOption) {
      return;
    }

    setIsSubmitting(true);
    try {
      const startParam = selectedStartDot != null ? String(selectedStartDot) : startPoint.trim();
      const endParam = selectedEndDot != null ? String(selectedEndDot) : endPoint.trim();
      const url = `${API_BASE}/path?start=${encodeURIComponent(startParam)}&end=${encodeURIComponent(endParam)}&choice=${encodeURIComponent(transportOption)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        onPathFound?.({ error: data?.error || "Failed to find path" });
        return;
      }
      onPathFound?.(data);
    } catch (err) {
      onPathFound?.({ error: "Something went wrong while finding the route" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const transportOptions = [
    {
      id: "lift",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      label: "Lift",
    },

    {
      id: "stair",

      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      label: "Stairs",
    },
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
        <form className="p-6" onSubmit={handleFindRoute}>
          <div className="space-y-6">
            {/* Start Point */}
            <div>
              <label htmlFor="start-point" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Start Point
              </label>
              <input
                type="text"
                id="start-point"
                value={startPoint}
                onChange={(e) => {
                  setStartPoint(e.target.value);
                  setSelectedStartDot(null);
                  setShowStartDropdown(true);
                }}
                onFocus={() => {
                  if (startPoint.trim()) setShowStartDropdown(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowStartDropdown(false), 120);
                }}
                className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm bg-white/80 backdrop-blur-sm"
                placeholder="Type room and select..."
                required
              />
              {showStartDropdown && (startSuggestions.length > 0 || startNoResults) && (
                <div className="mt-2 border border-orange-200 rounded-lg bg-white shadow-sm max-h-48 overflow-auto">
                  {startSuggestions.map((s) => (
                    <button
                      key={`${s.label}-${s.dot}`}
                      type="button"
                      onMouseDown={() => handleSelectStart(s.label, s.dot)}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 text-sm"
                    >
                      {s.label}
                    </button>
                  ))}
                  {startNoResults && startSuggestions.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">NO Rooms Found</div>}
                </div>
              )}
            </div>

            {/* End Point */}
            <div>
              <label htmlFor="end-point" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Destination
              </label>
              <input
                type="text"
                id="end-point"
                value={endPoint}
                onChange={(e) => {
                  setEndPoint(e.target.value);
                  setSelectedEndDot(null);
                  setShowEndDropdown(true);
                }}
                onFocus={() => {
                  if (endPoint.trim()) setShowEndDropdown(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowEndDropdown(false), 120);
                }}
                className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm bg-white/80 backdrop-blur-sm"
                placeholder="Type room and select..."
                required
              />
              {showEndDropdown && (endSuggestions.length > 0 || endNoResults) && (
                <div className="mt-2 border border-orange-200 rounded-lg bg-white shadow-sm max-h-48 overflow-auto">
                  {endSuggestions.map((s) => (
                    <button
                      key={`${s.label}-${s.dot}`}
                      type="button"
                      onMouseDown={() => handleSelectEnd(s.label, s.dot)}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 text-sm"
                    >
                      {s.label}
                    </button>
                  ))}
                  {endNoResults && endSuggestions.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">NO Rooms Found</div>}
                </div>
              )}
            </div>

            {/* Transport Options */}
            <div>
              <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Transport Options
              </label>
              <div className="flex gap-3">
                {transportOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setTransportOption(option.id)}
                    className={`flex-1 text-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      transportOption === option.id
                        ? "bg-gradient-to-br from-red-400 to-yellow-400 border-orange-500 text-white shadow-lg transform scale-105"
                        : "border-orange-300 hover:border-orange-400 hover:bg-orange-50 text-gray-700"
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className={`w-8 h-8 flex items-center justify-center ${transportOption === option.id ? "text-white" : "text-orange-500"}`}>
                        {option.icon}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${transportOption === option.id ? "text-white" : "text-gray-700"}`}>{option.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Find Route Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-br from-red-400 to-yellow-400 text-white py-4 px-6 rounded-xl font-semibold text-base hover:from-red-500 hover:to-yellow-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-orange-300"
            >
              {isSubmitting ? "Finding..." : "Find Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindRouteSection;
