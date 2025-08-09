import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FindRouteSection from "../components/FindRouteSection";

function FacultyDesk() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("faculty_desk");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
              email: "user@example.com"
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData({
            name: "User",
            email: "user@example.com"
          });
        }
      } else {
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
        <Header userData={userData} />

        {/* Main Content Area - Two Column Layout */}
        <div className="flex h-full">
          {/* Left Column - Main Content */}
          <div className="flex-1 p-8">
            {/* Faculty Desk Content */}


            
          </div>

          {/* Right Column - Find Your Route Section */}
          <FindRouteSection />
        </div>

      </div>
    </div>
  );
}

export default FacultyDesk;
