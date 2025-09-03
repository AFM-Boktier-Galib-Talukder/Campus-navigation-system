import React, { useState, useEffect } from "react";

function BillboardShowcase() {
  const [billboards, setBillboards] = useState([]);
  const [filteredBillboards, setFilteredBillboards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch billboards from API
  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:1490/api/billboards");
        if (!response.ok) throw new Error("Failed to fetch billboards");
        const data = await response.json();
        setBillboards(data);
        setFilteredBillboards(data);
        setError("");
      } catch (err) {
        setError("Failed to load events");
        setBillboards([]);
        setFilteredBillboards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, []);

  // Filter billboards based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBillboards(billboards);
    } else {
      const filtered = billboards.filter((billboard) =>
        billboard.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBillboards(filtered);
      setCurrentIndex(0); // Reset to first item when searching
    }
  }, [searchQuery, billboards]);

  // Auto-slide functionality
  useEffect(() => {
    if (filteredBillboards.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === filteredBillboards.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [filteredBillboards.length]);

  // Manual navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredBillboards.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredBillboards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentBillboard = filteredBillboards[currentIndex];

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-green-200/50">
        {/* Section Header */}
        <div className="p-6 border-b border-green-200/30 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Campus Events
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              {filteredBillboards.length > 0 &&
                `${currentIndex + 1} of ${filteredBillboards.length}`}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title..."
              className="w-full px-4 py-3 pl-10 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all text-sm bg-white/80 backdrop-blur-sm"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Billboard Content */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <div className="text-gray-600">Loading events...</div>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center py-32 px-8">
              <svg
                className="w-16 h-16 text-gray-400 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-600 text-center text-lg">{error}</p>
              <p className="text-gray-500 text-center text-sm mt-2">
                Please check your connection and try again
              </p>
            </div>
          ) : filteredBillboards.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-32 px-8">
              <svg
                className="w-16 h-16 text-gray-400 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-600 text-center text-lg">
                {searchQuery
                  ? "No events found matching your search"
                  : "No events available"}
              </p>
              <p className="text-gray-500 text-center text-sm mt-2">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Check back later for upcoming events"}
              </p>
            </div>
          ) : (
            <>
              {/* Billboard Display */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Event Image */}
                  <div className="billboard-container relative h-80 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                    <img
                      src={currentBillboard.imageBase64}
                      alt={currentBillboard.title}
                      className="billboard-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    {/* Event Type Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-br from-green-400 to-emerald-400 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      EVENT
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-6">
                    {/* Title */}
                    <h4 className="text-3xl font-bold text-gray-800 leading-tight">
                      {currentBillboard.title}
                    </h4>

                    {/* Date and Time Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-base text-gray-700 bg-green-50 rounded-lg p-3">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">
                            Date
                          </div>
                          <div className="font-semibold">
                            {formatDate(currentBillboard.date)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-base text-gray-700 bg-green-50 rounded-lg p-3">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">
                            Time
                          </div>
                          <div className="font-semibold">
                            {formatTime(currentBillboard.time)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Venue and Host Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-base text-gray-700 bg-green-50 rounded-lg p-3">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">
                            Venue
                          </div>
                          <div className="font-semibold">
                            {currentBillboard.venue}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-base text-gray-700 bg-green-50 rounded-lg p-3">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider">
                            Hosted by
                          </div>
                          <div className="font-semibold">
                            {currentBillboard.hostedBy}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-4 border border-green-200/50">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                        About this Event
                      </h5>
                      <p className="text-gray-700 leading-relaxed">
                        {currentBillboard.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              {filteredBillboards.length > 1 && (
                <div className="absolute top-1/2 transform -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
                  <button
                    onClick={goToPrevious}
                    className="w-12 h-12 bg-white/95 hover:bg-white shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 pointer-events-auto hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    className="w-12 h-12 bg-white/95 hover:bg-white shadow-xl rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 pointer-events-auto hover:scale-110"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Slide Indicators */}
              {filteredBillboards.length > 1 && (
                <div className="flex justify-center gap-3 p-6 border-t border-green-200/30 bg-gradient-to-r from-green-50/30 to-emerald-50/30">
                  {filteredBillboards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-gradient-to-r from-green-400 to-emerald-400 w-8 shadow-md"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BillboardShowcase;
