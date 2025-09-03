import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AmenitiesRouteSection from "../components/AmenitiesRouteSection";

function Amenities() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("amenities");
  const [userData, setUserData] = useState(null);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Predefined amenities that exist in the floors collection
  const amenities = [
    {
      id: "male-washroom",
      name: "Male Washroom",
      description: "Men's restroom facilities",
      icon: "🚹",
    },
    {
      id: "female-washroom",
      name: "Female Washroom",
      description: "Women's restroom facilities",
      icon: "🚺",
    },
    {
      id: "fire-exit",
      name: "FireExit",
      description: "Emergency fire exit routes",
      icon: "🚨",
    },
    {
      id: "medical-center",
      name: "Medical Center",
      description: "Health services and first aid",
      icon: "🏥",
    },
  ];

  // Get user data from location state or fetch from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (location.state?.userId) {
        try {
          const response = await fetch(
            `http://localhost:1490/api/signup/${location.state.userId}`
          );
          if (response.ok) {
            const user = await response.json();
            setUserData(user);
          } else {
            setUserData({
              name: "User",
              email: "user@example.com",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData({
            name: "User",
            email: "user@example.com",
          });
        }
      } else {
        setUserData({
          name: "User",
          email: "user@example.com",
        });
      }
    };

    fetchUserData();
  }, [location.state?.userId]);

  const handleNavClick = (itemId) => {
    setActiveNavItem(itemId);
    switch (itemId) {
      case "home":
        navigate("/homepage");
        break;
      case "faculty_desk":
        navigate("/faculty-desk");
        break;
      case "library":
        navigate("/library");
        break;
      case "amenities":
        navigate("/amenities");
        break;
      case "request":
        navigate("/request");
        break;
      case "navigation":
        navigate("/navigation");
        break;
      default:
        break;
    }
  };

  const handleAmenitySelect = (amenity) => {
    setSelectedAmenity(amenity);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50/90 to-emerald-50/90 font-inria">
      {/* Collapsible Sidebar */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        activeNavItem={activeNavItem}
        onNavClick={handleNavClick}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? "ml-70" : "ml-20"
        }`}
      >
        {/* Header */}
        <Header userData={userData} title="Campus Amenities" />

        {/* Main Content Area - Two Column Layout */}
        <div className="flex">
          {/* Left Column - Amenities Selection */}
          <div className="flex-1 p-8">
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-green-600">
                  Campus Amenities
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                Select an amenity to find directions from your location.
              </p>
            </div>

            {/* Amenities Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  onClick={() => handleAmenitySelect(amenity)}
                  className={`bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-green-600 hover:to-lime-300 rounded-xl p-6 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-150 hover:-translate-y-1 cursor-pointer group ${
                    selectedAmenity?.id === amenity.id
                      ? "bg-gradient-to-br from-green-600 to-lime-300 border-green-500 shadow-xl"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-xl font-bold transition-colors duration-150 ${
                        selectedAmenity?.id === amenity.id
                          ? "text-white"
                          : "text-gray-800 group-hover:text-white"
                      }`}
                    >
                      {amenity.name}
                    </h3>
                    <div className="text-3xl">{amenity.icon}</div>
                  </div>
                  <p
                    className={`mb-4 transition-colors duration-150 ${
                      selectedAmenity?.id === amenity.id
                        ? "text-white/90"
                        : "text-gray-600 group-hover:text-white/90"
                    }`}
                  >
                    {amenity.description}
                  </p>

                  {selectedAmenity?.id === amenity.id && (
                    <div className="mt-4 p-3 bg-white/20 rounded-lg border border-white/30">
                      <div className="flex items-center gap-2 text-white">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          Selected as destination
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selection Instructions */}
            {!selectedAmenity && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">
                      How to use:
                    </h4>
                    <p className="text-green-700 text-sm">
                      1. Click on any amenity card to select it as your
                      destination
                      <br />
                      2. Use the route finder on the right to enter your
                      starting point
                      <br />
                      3. Choose your preferred transport option and find your
                      route
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Amenities Route Section */}
          <AmenitiesRouteSection
            selectedAmenity={selectedAmenity}
            onPathFound={setRouteResult}
            onRouteComputed={setRouteResult}
          />
        </div>
      </div>
    </div>
  );
}

export default Amenities;
