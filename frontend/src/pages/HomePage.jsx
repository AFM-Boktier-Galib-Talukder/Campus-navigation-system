import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FindRouteSection from "../components/FindRouteSection";
import BillboardShowcase from "../components/BillboardShowcase";

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
          const response = await fetch(
            `http://localhost:1490/api/signup/${location.state.userId}`
          );
          if (response.ok) {
            const user = await response.json();
            setUserData(user);
          } else {
            // Set default user data if fetch fails
            setUserData({
              name: "User",
              email: "user@example.com",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Set default user data if fetch fails
          setUserData({
            name: "User",
            email: "user@example.com",
          });
        }
      } else {
        // Set default user data if no userId
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
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? "ml-70" : "ml-20"
        }`}
      >
        {/* Header */}
        <Header userData={userData} title="Welcome to CAMPUS-NAV" />

        {/* Main Content Area - Two Column Layout */}
        <div className="flex">
          {/* Left Column - Billboard Showcase */}
          <div className="flex-1 p-8">
            <BillboardShowcase />
          </div>

          {/* Right Column - Find Your Route Section */}
          <FindRouteSection onPathFound={setRouteResult} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
