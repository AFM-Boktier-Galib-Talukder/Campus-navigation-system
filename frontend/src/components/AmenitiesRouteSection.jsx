import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AmenitiesRouteSection({
  selectedAmenity,
  onPathFound,
  onRouteComputed,
}) {
  const [startPoint, setStartPoint] = useState("");
  const [transportOption, setTransportOption] = useState("lift");

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [startNoResults, setStartNoResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStartDot, setSelectedStartDot] = useState(null);
  const [showStartDropdown, setShowStartDropdown] = useState(false);

  const API_BASE = "http://localhost:1490/api/floor";
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleSelectStart = (label, dot) => {
    setStartPoint(label);
    setSelectedStartDot(dot);
    setStartSuggestions([]);
    setStartNoResults(false);
    setShowStartDropdown(false);
  };

  const handleFindRoute = async (e) => {
    e?.preventDefault();
    if (!startPoint.trim() || !selectedAmenity || !transportOption) {
      return;
    }

    setIsSubmitting(true);
    try {
      const startParam =
        selectedStartDot != null ? String(selectedStartDot) : startPoint.trim();
      const endParam = selectedAmenity.name; // Use amenity name as destination

      const url = `http://localhost:1490/api/amenity/path?start=${encodeURIComponent(
        startParam
      )}&destination=${encodeURIComponent(
        endParam
      )}&transport=${encodeURIComponent(transportOption)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        onPathFound?.({ error: data?.error || "Failed to find path" });
        onRouteComputed?.({ error: data?.error || "Failed to find path" });
        return;
      }
      onPathFound?.(data);
      onRouteComputed?.(data);

      // Always navigate to navigator page with result in state
      const navState = {
        routeResult: data,
        form: {
          startPoint,
          endPoint: selectedAmenity.name,
          transportOption,
          selectedStartDot,
          selectedEndDot: null,
        },
      };
      const isAlreadyOnNavigation = location.pathname === "/navigation";
      navigate("/navigation", {
        state: navState,
        replace: isAlreadyOnNavigation,
      });
    } catch (err) {
      const errorPayload = {
        error: "Something went wrong while finding the route",
      };
      onPathFound?.(errorPayload);
      onRouteComputed?.(errorPayload);
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
    <div className="w-96 p-8 border-l border-green-200/30 bg-gradient-to-br from-green-50/50 to-emerald-50/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-green-600 to-lime-400 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-green-600/50 sticky top-8">
        {/* Section Header */}
        <div className="p-6 border-b border-green-200/30 bg-gradient-to-r from-green-700 to-lime-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-lime-400 rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">
              Find Route to Amenity
            </h3>
          </div>
          <p className="text-white/80 text-sm">
            Navigate to your selected amenity
          </p>
        </div>

        {/* Route Search Form */}
        <form
          className="p-6 bg-gradient-to-br from-green-600 to-lime-400"
          onSubmit={handleFindRoute}
        >
          <div className="space-y-6">
            {/* Selected Amenity Display */}
            <div>
              <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Destination
              </label>
              <div className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/80 backdrop-blur-sm text-gray-700 text-sm flex items-center justify-between">
                <span>
                  {selectedAmenity
                    ? selectedAmenity.name
                    : "Select an amenity first"}
                </span>
                <span className="text-2xl">{selectedAmenity?.icon}</span>
              </div>
            </div>

            {/* Start Point */}
            <div>
              <label
                htmlFor="start-point"
                className="text-sm font-semibold text-white mb-2 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
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
                className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all text-sm bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-700"
                placeholder="Type room and select..."
                required
                disabled={!selectedAmenity}
              />
              {showStartDropdown &&
                (startSuggestions.length > 0 || startNoResults) && (
                  <div className="mt-2 border border-white/30 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm max-h-48 overflow-auto">
                    {startSuggestions.map((s) => (
                      <button
                        key={`${s.label}-${s.dot}`}
                        type="button"
                        onMouseDown={() => handleSelectStart(s.label, s.dot)}
                        className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm text-gray-800"
                      >
                        {s.label}
                      </button>
                    ))}
                    {startNoResults && startSuggestions.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        NO Rooms Found
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Transport Options */}
            <div>
              <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
                        ? "bg-white/30 border-white text-white shadow-lg transform scale-105"
                        : "border-white/30 hover:border-white/50 hover:bg-white/10 text-white/80"
                    } ${
                      !selectedAmenity ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{
                      pointerEvents: !selectedAmenity ? "none" : "auto",
                    }}
                  >
                    <div className="flex justify-center mb-2">
                      <div
                        className={`w-8 h-8 flex items-center justify-center ${
                          transportOption === option.id
                            ? "text-white"
                            : "text-white/80"
                        }`}
                      >
                        {option.icon}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        transportOption === option.id
                          ? "text-white"
                          : "text-white/80"
                      }`}
                    >
                      {option.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Find Route Button */}
            <button
              style={{ fontFamily: "'Inknut Antiqua', serif" }}
              type="submit"
              disabled={isSubmitting || !selectedAmenity}
              className={`w-full text-yellow-300 text-xl cursor-pointer bg-gradient-to-r from-lime-400 to-green-600 py-3 px-6 rounded-md hover:from-green-600 hover:to-lime-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 relative overflow-hidden group button-shine ${
                !selectedAmenity || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting
                ? "Finding..."
                : selectedAmenity
                ? "Find Route"
                : "Select Amenity"}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-3000 ease-out"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AmenitiesRouteSection;
