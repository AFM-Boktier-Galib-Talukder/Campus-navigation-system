import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import NavigationComponent from "../components/NavigationComponent";
import FacultyDeskSearch from "../components/FacultyDeskSearch";

function FacultyDesk() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("faculty_desk");
  const [userData, setUserData] = useState(null);
  const [facultyData, setFacultyData] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pathData, setPathData] = useState(null);
  const [navigationSteps, setNavigationSteps] = useState([]);
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
    const endInitial = faculty.initial;
    findPath("0", endInitial);
  };

  const findPath = async (startInitial, endInitial) => {
    try {
      const response = await fetch("http://localhost:1490/api/facultyDeskPath/find-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startInitial,
          endInitial,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNavigationSteps(data.steps);
        setPathData({
          distance: data.distance,
          time: data.time,
        });
      } else {
        console.error("Failed to find path");
      }
    } catch (error) {
      console.error("Error finding path:", error);
    }
  };

  const getInitialLetter = (facultyName) => {
    const parts = facultyName.split(" ");
    const namePart = parts.find((part) => !part.endsWith("."));
    return namePart ? namePart.charAt(0) : "";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50/90 to-emerald-50/90 font-inria">
      <Sidebar
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        activeNavItem={activeNavItem}
        onNavClick={handleNavClick}
      />

      <div className={`flex-1 transition-all duration-150 ${isSidebarExpanded ? "ml-70" : "ml-20"}`}>
        <Header userData={userData} title="Faculty Desk" />

        <div className="flex">
          <div className="flex-1 p-8">
            <div className="mb-8">
              <div className="relative mb-6 pr-4">
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
                  className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            )}

            {!loading && filteredFaculty.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No faculty members found matching your search.</p>
              </div>
            )}

            {!loading && filteredFaculty.length > 0 && (
              <div className="h-[1050px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-50">
                <div className="grid grid-cols-2 gap-6">
                  {filteredFaculty.map((faculty, index) => (
                    <div
                      key={index}
                      onClick={() => handleFacultyCardClick(faculty)}
                      className="bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-green-600 hover:to-lime-300 rounded-2xl p-6 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-150 hover:-translate-y-1 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-150 flex-1 mr-4">
                          {faculty.department}
                        </h3>
                        <div className="w-12 h-12 bg-green-500  group-hover:bg-white rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150">
                          <span className="text-white group-hover:text-green-400 text-lg font-bold transition-colors duration-150">
                            {getInitialLetter(faculty.faculty)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-2">
                          <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-150">
                            <span className="font-semibold text-gray-800 group-hover:text-white transition-colors duration-150">Faculty:</span>
                            <span className="ml-2">{faculty.faculty}</span>
                          </p>
                          <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-150">
                            <span className="font-semibold text-gray-800 group-hover:text-white transition-colors duration-150">Initial:</span>
                            <span className="ml-2">{faculty.initial}</span>
                          </p>
                          <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-150">
                            <span className="font-semibold text-gray-800 group-hover:text-white transition-colors duration-150">Office:</span>
                            <span className="ml-2">{faculty.office}</span>
                          </p>
                          <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-150 break-all">
                            <span className="font-semibold text-gray-800 group-hover:text-white transition-colors duration-150">Email:</span>
                            <span className="ml-2 text-sm">{faculty.email}</span>
                          </p>
                          <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-150">
                            <span className="font-semibold text-gray-800 group-hover:text-white transition-colors duration-150">Phone:</span>
                            <span className="ml-2">{faculty.phone}</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 text-center pt-4 border-t border-green-100 group-hover:border-white/30 transition-colors duration-150">
                        <span className="text-sm text-green-600 group-hover:text-white font-medium transition-colors duration-150">
                          Click to navigate to office →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 p-3 flex flex-col">
            <FacultyDeskSearch onFindPath={findPath} />
            <NavigationComponent navigationSteps={navigationSteps} pathData={pathData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDesk;
