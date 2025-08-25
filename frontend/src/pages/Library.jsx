import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FindRouteSection from "../components/FindRouteSection";

function Library() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("library");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function loadLibraryRooms() {
      try {
        const resp = await fetch("http://localhost:1490/api/library/nodes");
        if (!resp.ok) return;
        const nodes = await resp.json();
        const list = [];
        for (const n of nodes) {
          const leftVal = typeof n.left === "string" ? n.left.trim() : "";
          const rightVal = typeof n.right === "string" ? n.right.trim() : "";
          if (leftVal) list.push({ label: leftVal, dot: n.dot });
          if (rightVal) list.push({ label: rightVal, dot: n.dot });
        }
        setRooms(list);
      } catch (_) {}
    }
    loadLibraryRooms();
  }, []);

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
        <Header userData={userData} title="Library" />

        {/* Main Content Area - Two Column Layout */}
        <div className="flex h-full">
          {/* Left Column - Main Content */}
          <div className="flex-1 p-8">
            {/* Dynamic Rooms from MongoDB (library collection) */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-orange-600 mb-2">
                Library Services
              </h2>
              <p className="text-gray-600">
                All Library rooms and spots are listed below.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((r, idx) => (
                <div
                  key={`${r.label}-${idx}`}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-orange-600">
                      {r.label}
                    </h3>
                  </div>
                  <div className="text-gray-600 text-sm">
                    Location within library graph
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Find Your Route Section */}
          <FindRouteSection apiBaseOverride="http://localhost:1490/api/library" />
        </div>
      </div>
    </div>
  );
}

export default Library;
