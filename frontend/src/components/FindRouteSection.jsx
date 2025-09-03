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
      } catch {
        setStartSuggestions([]);
        setStartNoResults(true);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [startPoint, showStartDropdown]);

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
      } catch {
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
    } catch {
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
    <div className="w-85 p-8 pl-3 pr-3">
      <div className="bg-gradient-to-br from-green-600 to-lime-400 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-green-600/50 sticky">
        <div className="p-6 border-b border-green-200/30 bg-gradient-to-r from-green-700 to-lime-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-lime-400 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Find Your Route</h3>
          </div>
          <p className="text-white text-sm">Plan your navigation across campus</p>
        </div>

        <form className="p-6" onSubmit={handleFindRoute}>
          <div className="space-y-6">
            <div>
              <label htmlFor="start-point" className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400  transition-all text-sm bg-white/80 backdrop-blur-sm"
                placeholder="Type room and select..."
                required
              />
              {showStartDropdown && (startSuggestions.length > 0 || startNoResults) && (
                <div className="mt-2 border border-green-200 rounded-lg bg-white shadow-sm max-h-48 overflow-auto">
                  {startSuggestions.map((s) => (
                    <button
                      key={`${s.label}-${s.dot}`}
                      type="button"
                      onMouseDown={() => handleSelectStart(s.label, s.dot)}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm"
                    >
                      {s.label}
                    </button>
                  ))}
                  {startNoResults && startSuggestions.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">NO Rooms Found</div>}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="end-point" className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400  transition-all text-sm bg-white/80 backdrop-blur-sm"
                placeholder="Type room and select..."
                required
              />
              {showEndDropdown && (endSuggestions.length > 0 || endNoResults) && (
                <div className="mt-2 border border-green-200 rounded-lg bg-white shadow-sm max-h-48 overflow-auto">
                  {endSuggestions.map((s) => (
                    <button
                      key={`${s.label}-${s.dot}`}
                      type="button"
                      onMouseDown={() => handleSelectEnd(s.label, s.dot)}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm"
                    >
                      {s.label}
                    </button>
                  ))}
                  {endNoResults && endSuggestions.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">NO Rooms Found</div>}
                </div>
              )}
            </div>

            <div>
              <label className=" text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                        ? "bg-gradient-to-br from-green-400 to-lime-400 border-green-500 text-white shadow-lg transform scale-105"
                        : "border-green-300 hover:border-green-400 hover:bg-green-50 text-gray-800"
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      <div className={`w-8 h-8 flex items-center justify-center ${transportOption === option.id ? "text-white" : "text-lime-300"}`}>
                        {option.icon}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${transportOption === option.id ? "text-white" : "text-lime-300"}`}>{option.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              style={{ fontFamily: "'Inknut Antiqua', serif" }}
              type="submit"
              disabled={isSubmitting}
              className="w-full text-yellow-300 text-xl cursor-pointer bg-gradient-to-r from-lime-400 to-green-600 py-2 px-4 rounded-md hover:from-green-600 hover:to-lime-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 relative overflow-hidden group button-shine"
            >
              {isSubmitting ? "Finding..." : "Find Route"}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-3000 ease-out"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindRouteSection;
