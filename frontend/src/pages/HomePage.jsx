import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FindRouteSection from "../components/FindRouteSection";

function HomePage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [userData, setUserData] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from location state or fetch from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (location.state?.userId) {
        try {
          // Fetch user data from API using userId
          const response = await fetch(`http://localhost:1490/api/signup/${location.state.userId}`);
          if (response.ok) {
            const user = await response.json();
            setUserData(user);
          } else {
            // Set default user data if fetch fails
            setUserData({
              name: "User",
              email: "user@example.com"
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Set default user data if fetch fails
          setUserData({
            name: "User",
            email: "user@example.com"
          });
        }
      } else {
        // Set default user data if no userId
        setUserData({
          name: "User",
          email: "user@example.com"
        });
      }
    };

    fetchUserData();
  }, [location.state?.userId]);

  const handleNavClick = (itemId) => {
    setActiveNavItem(itemId);
    switch(itemId) {
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
      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-70' : 'ml-20'}`}>
        {/* Header */}
        <Header userData={userData} title="Welcome to CAMPUS-NAV" />

        {/* Main Content Area - Two Column Layout */}
        <div className="flex h-full">
          {/* Left Column - Main Content */}
          <div className="flex-1 p-8">
            {/* Slideshow Banner */}
            <div className="h-96 rounded-3xl overflow-hidden relative shadow-2xl bg-gradient-to-br from-orange-400 to-yellow-400">
              <div className="absolute inset-0 flex items-center justify-between p-16">
                <div className="flex-1 text-white">
                  <div className="bg-white/20 text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider inline-block mb-6">
                    New Feature
                  </div>
                  <h2 className="text-5xl font-bold leading-tight mb-6 font-inknut">
                    Smart Campus Navigation
                  </h2>
                  <p className="text-xl opacity-90 max-w-md mb-8">
                    Find your way around campus with intelligent pathfinding and real-time directions.
                  </p>
                  <div className="flex gap-4">
                    <button className="bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold border-2 border-white/30 backdrop-blur-lg hover:bg-white/30 hover:-translate-y-1 transition-all">
                      Start Navigation
                    </button>
                    <button className="text-white/80 px-8 py-4 rounded-2xl font-semibold border-2 border-white/20 hover:bg-white/10 hover:text-white transition-all">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="flex-0 w-72 h-72 bg-white/10 rounded-3xl flex items-center justify-center text-8xl text-white/30 backdrop-blur-xl">
                  🗺️
                </div>
              </div>
            </div>

            {/* Route result is not shown on Home page per requirements */}
          </div>

          {/* Right Column - Find Your Route Section */}
          <FindRouteSection onPathFound={setRouteResult} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
