import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FindRouteSection from "../components/FindRouteSection";

function FacultyDesk() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("faculty_desk");
  const [userData, setUserData] = useState(null);
  const [facultyData, setFacultyData] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
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

  // Fetch faculty data
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await fetch("http://localhost:1490/api/facultyDesk");
        if (response.ok) {
          const data = await response.json();
          setFacultyData(data);
          setFilteredFaculty(data);
        } else {
          console.error("Failed to fetch faculty data");
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFaculty(facultyData);
    } else {
      const filtered = facultyData.filter(
        (faculty) =>
          faculty.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faculty.initial.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaculty(filtered);
    }
  }, [searchTerm, facultyData]);

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

  const handleFacultyCardClick = (faculty) => {
    navigate("/navigation", {
      state: {
        destination: faculty.office,
        facultyName: faculty.faculty,
        department: faculty.department,
      },
    });
  };

  const getInitialLetter = (facultyName) => {
    const parts = facultyName.split(" ");
    const namePart = parts.find((part) => !part.endsWith("."));
    return namePart ? namePart.charAt(0) : "";
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
        <Header userData={userData} title="Faculty Desk" />

        {/* Main Content Area - Two Column Layout */}
        <div className="flex">
          {/* Left Column - Main Content */}
          <div className="flex-1 p-8">
            {/* Faculty Desk Content */}

            <div className="mb-8">
              <div className="text-2xl mb-3 font-bold font-inknut whitespace-nowrap">
                <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
                  Faculty Desk
                </span>
              </div>
              <p className="text-orange-400 mb-6">
                Access faculty information, office locations, and contact
                details.
              </p>

              {/* Search Bar */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by faculty name, initials, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            )}

            {/* No Results */}
            {!loading && filteredFaculty.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No faculty members found matching your search.
                </p>
              </div>
            )}

            {/* Faculty Information Cards */}
            {!loading && filteredFaculty.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFaculty.map((faculty, index) => (
                  <div
                    key={index}
                    onClick={() => handleFacultyCardClick(faculty)}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {faculty.department}
                      </h3>
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-yellow-400 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {getInitialLetter(faculty.faculty)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-semibold">Faculty:</span>{" "}
                        {faculty.faculty}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Initial:</span>{" "}
                        {faculty.initial}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Office:</span>{" "}
                        {faculty.office}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Email:</span>{" "}
                        {faculty.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Phone:</span>{" "}
                        {faculty.phone}
                      </p>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-sm text-orange-600 group-hover:text-orange-800 font-medium">
                        Click to navigate to office →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Find Your Route Section */}
          <FindRouteSection />
        </div>
      </div>
    </div>
  );
}

export default FacultyDesk;
