import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FindRouteSection from "../components/FindRouteSection";
import NavigationComponent from "../components/NavigationComponent";

function Navigation() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("navigation");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Sample navigation steps - can be passed as props or fetched from API
  const navigationSteps = [
    { direction: "start", message: "Ready to begin your journey to the library", angle: 0 },
    { direction: "forward", message: "Walk straight for 100 meters towards the main entrance", angle: 0 },
    { direction: "right", message: "Turn right at the information desk", angle: 90 },
    { direction: "forward", message: "Continue straight through the corridor for 50 meters", angle: 0 },
    { direction: "left", message: "Turn left at the fountain towards the academic building", angle: -90 },
    { direction: "up", message: "Take the stairs to the second floor", angle: 0 },
    { direction: "right", message: "Turn right after reaching the second floor", angle: 90 },
    { direction: "destination", message: "Welcome to the University Library! You have arrived.", angle: 0 },
  ];

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
        <Header userData={userData} />

        {/* Main Content Area - Two Column Layout */}
        <div className="flex h-full">
          {/* Left Column - Navigation Component */}
          <NavigationComponent navigationSteps={navigationSteps} />

          {/* Right Column - Find Your Route Section */}
          <FindRouteSection />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
