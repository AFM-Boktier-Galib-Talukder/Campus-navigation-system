import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FindRouteSection from "../components/FindRouteSection";

function Navigation() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("navigation");
  const [userData, setUserData] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize route result from navigation state if provided
  useEffect(() => {
    if (location.state?.routeResult) {
      setRouteResult(location.state.routeResult);
    }
  }, [location.state]);

  // Get user data from location state or fetch from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (location.state?.userId) {
        try {
          const response = await fetch(`http://localhost:1490/api/signup/${location.state.userId}`);
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 font-inria">
      {/* Collapsible Sidebar */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        activeNavItem={activeNavItem}
        onNavClick={handleNavClick}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? "ml-70" : "ml-20"}`}>
        {/* Header */}
        <Header userData={userData} title="Navigator" />

        {/* Main Content Area - Two Column Layout */}
        <div className="flex h-full">
          {/* Left Column - Shortest Path Result */}
          <div className="flex-1 p-8">
            {/* Result Box */}
            {routeResult && !routeResult.error && (
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-orange-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Route Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/50">
                    <div className="text-gray-600">Path (dots)</div>
                    <div className="font-mono text-gray-900 break-all">{Array.isArray(routeResult.path) ? routeResult.path.join(" → ") : "-"}</div>
                  </div>
                  <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/50">
                    <div className="text-gray-600">Estimated Time</div>
                    <div className="text-gray-900 font-medium">{routeResult.distance || "-"}</div>
                  </div>
                  <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/50">
                    <div className="text-gray-600">Start / End Dots</div>
                    <div className="text-gray-900 font-medium">{routeResult.startDot} → {routeResult.endDot}</div>
                  </div>
                </div>
                {Array.isArray(routeResult.directions) && routeResult.directions.length > 0 && (
                  <div className="mt-4">
                    <div className="text-gray-700 font-medium mb-2">Turn-by-turn</div>
                    <ul className="list-disc ml-6 space-y-1 text-gray-800">
                      {routeResult.directions.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {routeResult?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                {routeResult.error}
              </div>
            )}
          </div>

          {/* Right Column - Find Your Route Section */}
          <FindRouteSection onPathFound={setRouteResult} onRouteComputed={setRouteResult} />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
