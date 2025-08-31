import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";
import DotEditModal from "../components/DotEditModal";

function AdminDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("admin_home");
  const [userData, setUserData] = useState(null);
  const [floorDots, setFloorDots] = useState([]);
  const [filteredDots, setFilteredDots] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDot, setSelectedDot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = location.state?.userId || localStorage.getItem("userId");
      if (!userId) return;
      try {
        const resp = await fetch(`http://localhost:1490/api/signup/${userId}`);
        if (resp.ok) {
          const user = await resp.json();
          setUserData(user);
        }
      } catch (_) {}
    };
    fetchUserData();
  }, [location.state?.userId]);

  // Fetch all floor dots
  useEffect(() => {
    const fetchFloorDots = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:1490/api/admin/floor/dots`
        );
        if (response.ok) {
          const data = await response.json();
          setFloorDots(data.data || []);
          setFilteredDots(data.data || []);
        } else {
          console.error("Failed to fetch floor dots");
        }
      } catch (error) {
        console.error("Error fetching floor dots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFloorDots();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDots(floorDots);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = floorDots.filter(
        (dot) =>
          (dot.left && dot.left.toLowerCase().includes(query)) ||
          (dot.right && dot.right.toLowerCase().includes(query))
      );
      setFilteredDots(filtered);
    }
  }, [searchQuery, floorDots]);

  const handleNavClick = (itemId) => {
    setActiveNavItem(itemId);
    switch (itemId) {
      case "admin_home":
        navigate("/admin-dashboard");
        break;
      case "admin_events":
        navigate("/admin/events");
        break;
      case "admin_request":
        navigate("/admin/request");
        break;
      default:
        break;
    }
  };

  const handleDotClick = (dot) => {
    setSelectedDot(dot);
    setIsModalOpen(true);
  };

  const handleSaveDot = async (formData) => {
    try {
      const response = await fetch(
        `http://localhost:1490/api/admin/floor/dots/${selectedDot.dot}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        // Update the local state
        setFloorDots((prev) =>
          prev.map((dot) =>
            dot.dot === selectedDot.dot ? updatedData.data : dot
          )
        );
        setIsModalOpen(false);
        setSelectedDot(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update dot");
      }
    } catch (error) {
      console.error("Error saving dot:", error);
      alert("Failed to save changes: " + error.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDot(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 font-inria">
      <AdminSidebar
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
        <Header userData={userData} title="Admin Dashboard" />

        <div className="p-8">
          {/* Top section with instruction + dots count on left, search bar on right */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-6">
              {/* Left side: Instruction and dots count */}
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-200 mb-3 w-fit">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-orange-800 font-medium text-sm whitespace-nowrap">
                    💡 Click on any card below to edit the dot information
                  </span>
                </div>
                <div className="text-gray-600 text-sm pl-2">
                  {filteredDots.length} of {floorDots.length} dots
                  {searchQuery && ` matching "${searchQuery}"`}
                </div>
              </div>

              {/* Right side: Search bar - Pushed to far right */}
              <div className="flex-shrink-0 lg:w-115">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="Search by rooms..."
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="mb-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">
                  Loading floor data...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDots.map((dot) => (
                  <div
                    key={dot.dot}
                    onClick={() => handleDotClick(dot)}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group hover:border-orange-300"
                  >
                    {/* Dot Title */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-orange-600">
                        Dot {dot.dot}
                      </h3>
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Connections */}
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Connections:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {dot.connection && dot.connection.length > 0 ? (
                          dot.connection.map((conn, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium"
                            >
                              {conn}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-xs italic">
                            No connections
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Left and Right Rooms */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">
                          Left:
                        </p>
                        <p className="text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded min-h-[24px]">
                          {dot.left || (
                            <span className="text-gray-400 italic">Empty</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">
                          Right:
                        </p>
                        <p className="text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded min-h-[24px]">
                          {dot.right || (
                            <span className="text-gray-400 italic">Empty</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Up and Down */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">
                          Up:
                        </p>
                        <p className="text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded min-h-[24px]">
                          {dot.up !== null ? (
                            dot.up
                          ) : (
                            <span className="text-gray-400 italic">null</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">
                          Down:
                        </p>
                        <p className="text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded min-h-[24px]">
                          {dot.down !== null ? (
                            dot.down
                          ) : (
                            <span className="text-gray-400 italic">null</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && filteredDots.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? `No rooms found matching "${searchQuery}"`
                    : "No floor data available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <DotEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dotData={selectedDot}
        onSave={handleSaveDot}
      />
    </div>
  );
}

export default AdminDashboard;
