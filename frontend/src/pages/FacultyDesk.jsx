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
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Faculty Desk</h2>
              <p className="text-gray-600 mb-6">
                Access faculty information, office locations, and contact details.
              </p>
            </div>

            {/* Faculty Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Computer Science",
                  faculty: "Dr. John Smith",
                  office: "Room 301, Block A",
                  email: "john.smith@bracu.ac.bd",
                  phone: "+880-2-9844051"
                },
                {
                  title: "Electrical Engineering",
                  faculty: "Dr. Sarah Johnson",
                  office: "Room 205, Block B",
                  email: "sarah.johnson@bracu.ac.bd",
                  phone: "+880-2-9844052"
                },
                {
                  title: "Business Administration",
                  faculty: "Dr. Michael Brown",
                  office: "Room 401, Block C",
                  email: "michael.brown@bracu.ac.bd",
                  phone: "+880-2-9844053"
                },
                {
                  title: "Mathematics",
                  faculty: "Dr. Emily Davis",
                  office: "Room 102, Block A",
                  email: "emily.davis@bracu.ac.bd",
                  phone: "+880-2-9844054"
                },
                {
                  title: "Physics",
                  faculty: "Dr. Robert Wilson",
                  office: "Room 303, Block B",
                  email: "robert.wilson@bracu.ac.bd",
                  phone: "+880-2-9844055"
                },
                {
                  title: "Chemistry",
                  faculty: "Dr. Lisa Anderson",
                  office: "Room 201, Block C",
                  email: "lisa.anderson@bracu.ac.bd",
                  phone: "+880-2-9844056"
                }
              ].map((department, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{department.title}</h3>
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-yellow-400 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">F</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600"><span className="font-semibold">Faculty:</span> {department.faculty}</p>
                    <p className="text-gray-600"><span className="font-semibold">Office:</span> {department.office}</p>
                    <p className="text-gray-600"><span className="font-semibold">Email:</span> {department.email}</p>
                    <p className="text-gray-600"><span className="font-semibold">Phone:</span> {department.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Find Your Route Section */}
          <FindRouteSection />
        </div>
      </div>
    </div>
  );
}

export default FacultyDesk;
