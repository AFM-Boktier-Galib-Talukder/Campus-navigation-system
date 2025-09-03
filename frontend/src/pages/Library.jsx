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
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 font-inria">
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
        <div className="flex">
          {/* Left Column - Main Content */}
          <div className="flex-1 p-8">
            {/* Dynamic Rooms from MongoDB (library collection) */}
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
                  Library Services
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                All Library rooms and spots are listed below.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.length === 0 ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Loading library rooms...</p>
                  </div>
                </div>
              ) : (
                rooms.map((r, idx) => (
                  <div
                    key={`${r.label}-${idx}`}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md border border-green-200/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-green-600 leading-tight">
                        {r.label}
                      </h3>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Location within library
                    </div>
                  </div>
                ))
              )}
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
