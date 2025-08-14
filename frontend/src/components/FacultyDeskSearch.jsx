import React, { useEffect, useState } from "react";

function FacultyDeskSearch({ onFindPath }) {
  const [startInitial, setStartInitial] = useState("");
  const [endInitial, setEndInitial] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [startNoResults, setStartNoResults] = useState(false);
  const [endNoResults, setEndNoResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStartDot, setSelectedStartDot] = useState(null);
  const [selectedEndDot, setSelectedEndDot] = useState(null);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);

  const API_BASE = "http://localhost:1490/api/facultyDeskPath";

  async function fetchSuggestions(query) {
    const url = `${API_BASE}/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    return data.results || [];
  }

  useEffect(() => {
    if (!showStartDropdown) return;
    const q = startInitial.trim();
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
  }, [startInitial, showStartDropdown]);

  useEffect(() => {
    if (!showEndDropdown) return;
    const q = endInitial.trim();
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
  }, [endInitial, showEndDropdown]);

  const handleSelectStart = (label, dot) => {
    setStartInitial(label);
    setSelectedStartDot(dot);
    setStartSuggestions([]);
    setStartNoResults(false);
    setShowStartDropdown(false);
  };

  const handleSelectEnd = (label, dot) => {
    setEndInitial(label);
    setSelectedEndDot(dot);
    setEndSuggestions([]);
    setEndNoResults(false);
    setShowEndDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startInitial.trim() || !endInitial.trim()) return;

    setIsSubmitting(true);
    try {
      const start = selectedStartDot || startInitial.trim().toUpperCase();
      const end = selectedEndDot || endInitial.trim().toUpperCase();
      onFindPath(start, end);
    } catch (err) {
      console.error("Error finding route:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-orange-200/50 sticky">
        <div className="p-6 border-b border-orange-200/30 bg-gradient-to-r from-orange-50/50 to-yellow-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-yellow-400 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Find Faculty Desk</h3>
          </div>
          <p className="text-gray-600 text-sm">Search your faculty's desk location</p>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="start-point" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Start Faculty Initial
              </label>
              <input
                type="text"
                id="start-point"
                value={startInitial}
                onChange={(e) => {
                  setStartInitial(e.target.value);
                  setSelectedStartDot(null);
                  setShowStartDropdown(true);
                }}
                onFocus={() => {
                  if (startInitial.trim()) setShowStartDropdown(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowStartDropdown(false), 120);
                }}
                className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all text-sm bg-white/80 backdrop-blur-sm"
                placeholder="e.g. JMT"
                required
              />
              {showStartDropdown && (startSuggestions.length > 0 || startNoResults) && (
                <div className="mt-2 border border-orange-200 rounded-lg bg-white shadow-sm max-h-48 overflow-auto">
                  {startSuggestions.map((s) => (
                    <button
                      key={`${s.label}-${s.dot}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectStart(s.label, s.dot);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 text-sm"
                    >
                      {s.label}
                    </button>
                  ))}
                  {startNoResults && startSuggestions.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">No Rooms Found</div>}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="end-point" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Destination Faculty Initial
              </label>
              <input
                type="text"
                id="end-point"
                value={endInitial}
                onChange={(e) => {
                  setEndInitial(e.target.value);
                  setSelectedEndDot(null);
                  setShowEndDropdown(true);
                }}
                onFocus={() => {
                  if (endInitial.trim()) setShowEndDropdown(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowEndDropdown(false), 120);
                }}
                className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all text-sm bg-white/80 backdrop-blur-sm"
                placeholder="e.g. SJH"
                required
              />
              {showEndDropdown && (endSuggestions.length > 0 || endNoResults) && (
                <div className="mt-2 border border-orange-200 rounded-lg bg-white shadow-sm max-h-48 overflow-auto">
                  {endSuggestions.map((s) => (
                    <button
                      key={`${s.label}-${s.dot}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectEnd(s.label, s.dot);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 text-sm"
                    >
                      {s.label}
                    </button>
                  ))}
                  {endNoResults && endSuggestions.length === 0 && <div className="px-4 py-2 text-sm text-gray-500">No Rooms Found</div>}
                </div>
              )}
            </div>

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

export default FacultyDeskSearch;
