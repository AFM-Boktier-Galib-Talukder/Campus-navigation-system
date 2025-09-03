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
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [pathData, setPathData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUser(true);
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
      setIsLoadingUser(false);
    };

    fetchUserData();
  }, [location.state?.userId]);

  // Handle incoming route result from homepage
  useEffect(() => {
    if (location.state?.routeResult && !isLoadingUser) {
      console.log("Processing route result from homepage:", location.state.routeResult);
      try {
        const routeData = location.state.routeResult;
        // Validate that the route data has required properties
        if (routeData && (routeData.directions || routeData.error)) {
          handlePathFound(routeData);
        } else {
          console.warn("Invalid route data structure:", routeData);
          setNavigationSteps([
            {
              direction: "start",
              message: "Invalid route data received. Please try again.",
              angle: 0,
            },
          ]);
          setPathData(null);
        }
      } catch (error) {
        console.error("Error processing route result:", error);
        // Set a default error state to prevent blank screen
        setNavigationSteps([
          {
            direction: "start",
            message: "Error processing route data. Please try again.",
            angle: 0,
          },
        ]);
        setPathData(null);
      }
    }
  }, [location.state?.routeResult, isLoadingUser]);

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

  // Show loading screen while user data is being fetched
  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 font-inria">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 font-inria">
      <Sidebar
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        activeNavItem={activeNavItem}
        onNavClick={handleNavClick}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? "ml-70" : "ml-20"}`}>
        <Header userData={userData} title="Navigation" />

        <div className="flex">
          <NavigationComponent navigationSteps={navigationSteps} pathData={pathData} />

          <FindRouteSection onPathFound={handlePathFound} />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
