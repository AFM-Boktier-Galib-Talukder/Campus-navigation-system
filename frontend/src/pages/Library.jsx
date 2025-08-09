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
            {/* Library Content */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Library Services</h2>
              <p className="text-gray-600 mb-6">
                Access library resources, study spaces, and academic services.
              </p>
            </div>

            {/* Library Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Study Spaces",
                  description: "Quiet study areas and group study rooms",
                  capacity: "200+ seats",
                  availability: "24/7",
                  icon: "📚"
                },
                {
                  title: "Digital Resources",
                  description: "Online databases and e-books",
                  capacity: "50,000+ titles",
                  availability: "Online",
                  icon: "💻"
                },
                {
                  title: "Research Support",
                  description: "Research assistance and citation help",
                  capacity: "Expert staff",
                  availability: "9 AM - 8 PM",
                  icon: "🔍"
                },
                {
                  title: "Printing Services",
                  description: "Print, scan, and copy services",
                  capacity: "Multiple stations",
                  availability: "8 AM - 10 PM",
                  icon: "🖨️"
                },
                {
                  title: "Book Borrowing",
                  description: "Physical book lending service",
                  capacity: "100,000+ books",
                  availability: "9 AM - 8 PM",
                  icon: "📖"
                },
                {
                  title: "Special Collections",
                  description: "Rare books and special materials",
                  capacity: "Limited access",
                  availability: "By appointment",
                  icon: "🏛️"
                }
              ].map((service, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                    <div className="text-3xl">{service.icon}</div>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500"><span className="font-semibold">Capacity:</span> {service.capacity}</p>
                    <p className="text-sm text-gray-500"><span className="font-semibold">Hours:</span> {service.availability}</p>
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

export default Library;