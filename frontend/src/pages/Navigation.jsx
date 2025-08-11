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
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [pathData, setPathData] = useState(null);
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

  // Handle path found from FindRouteSection
  const handlePathFound = (data) => {
    if (data.error) {
      // Handle error case
      console.error("Path finding error:", data.error);
      setNavigationSteps([
        {
          direction: "start",
          message: `Error: ${data.error}`,
          angle: 0,
        },
      ]);
      setPathData(null);
      return;
    }

    // Convert backend directions to navigation steps format
    const steps = [];

    // Add start step
    steps.push({
      direction: "start",
      message: "Ready to begin your journey",
      angle: 0,
    });

    // Convert directions to navigation steps
    data.directions.forEach((direction, _) => {
      let stepDirection = "forward";
      let angle = 0;

      // Parse direction text to determine step type
      const lowerDirection = direction.toLowerCase();
      if (lowerDirection.includes("go up") || lowerDirection.includes("using lift") || lowerDirection.includes("using stair")) {
        stepDirection = "up";
        angle = 0;
      } else if (lowerDirection.includes("go down")) {
        stepDirection = "down";
        angle = 0;
      } else if (lowerDirection.includes("left")) {
        stepDirection = "left";
        angle = -90;
      } else if (lowerDirection.includes("right")) {
        stepDirection = "right";
        angle = 90;
      } else if (lowerDirection.includes("reach your destination")) {
        stepDirection = "destination";
        angle = 0;
      }

      steps.push({
        direction: stepDirection,
        message: direction.replace(/\n/g, " "), // Remove line breaks for better display
        angle: angle,
      });
    });

    // Add final destination step if not already present
    if (steps[steps.length - 1].direction !== "destination") {
      steps.push({
        direction: "destination",
        message: "You have reached your destination!",
        angle: 0,
      });
    }

    setNavigationSteps(steps);
    setPathData(data);
  };

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
          <NavigationComponent navigationSteps={navigationSteps} pathData={pathData} />

          {/* Right Column - Find Your Route Section */}
          <FindRouteSection onPathFound={handlePathFound} />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
