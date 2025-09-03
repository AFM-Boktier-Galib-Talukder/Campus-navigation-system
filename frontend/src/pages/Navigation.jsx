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

  const handlePathFound = (data) => {
    if (data.error) {
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

    const steps = [];

    steps.push({
      direction: "start",
      message: "Ready to begin your journey",
      angle: 0,
    });

    console.log(data.directions);

    data.directions.forEach((direction) => {
      let stepDirection = "forward";
      let angle = 0;

      const lowerDirection = direction.toLowerCase();
      if (lowerDirection.includes("go up")) {
        stepDirection = "up";
        angle = 0;
      } else if (lowerDirection.includes("go down")) {
        stepDirection = "down";
        angle = 0;
      } else if (lowerDirection.includes("go ahead & turn left")) {
        stepDirection = "left";
        angle = 270;
      } else if (lowerDirection.includes("go ahead & turn right")) {
        stepDirection = "right";
        angle = 90;
      } else if (lowerDirection.includes("move forward")) {
        stepDirection = "forward";
        angle = 0;
      } else if (lowerDirection.includes("move backward")) {
        stepDirection = "backward";
        angle = 180;
      } else if (lowerDirection.includes("reach your destination")) {
        stepDirection = "destination";
        angle = 0;
      }

      steps.push({
        direction: stepDirection,
        message: direction.replace(/\n/g, " "),
        angle: angle,
      });
    });
    console.log(steps);

    if (steps[steps.length - 1].direction !== "destination") {
      steps.push({
        direction: "destination",
        message: "Congratulations You have reached your destination!",
        angle: 0,
      });
    }

    setNavigationSteps(steps);
    setPathData(data);
  };

  // Handle incoming route result from any page (homepage, library, etc.) - placed after handlePathFound is defined
  useEffect(() => {
    if (location.state?.routeResult) {
      console.log(
        "Processing route result:",
        location.state.routeResult
      );
      handlePathFound(location.state.routeResult);
    }
  }, [location.state?.routeResult]);

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
      <Sidebar
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        activeNavItem={activeNavItem}
        onNavClick={handleNavClick}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? "ml-70" : "ml-20"
        }`}
      >
        <Header userData={userData} title="Navigation" />

        <div className="flex">
          <NavigationComponent
            navigationSteps={navigationSteps}
            pathData={pathData}
          />

          <FindRouteSection onPathFound={handlePathFound} />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
