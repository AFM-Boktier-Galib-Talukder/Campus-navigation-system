import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Amenities() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("amenities");
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

        {/* Main Content Area */}
        <div className="p-8">
          {/* Amenities Content */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Campus Amenities</h2>
            <p className="text-gray-600 mb-6">
              Discover all the facilities and services available on campus.
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Cafeteria",
                description: "Multiple dining options with various cuisines",
                location: "Ground Floor, Block A",
                hours: "7 AM - 10 PM",
                icon: "🍽️"
              },
              {
                title: "Student Lounge",
                description: "Comfortable seating areas for relaxation",
                location: "2nd Floor, Block B",
                hours: "24/7",
                icon: "🛋️"
              },
              {
                title: "Gym & Fitness Center",
                description: "Modern fitness equipment and training facilities",
                location: "Basement, Block C",
                hours: "6 AM - 11 PM",
                icon: "��️"
              },
              {
                title: "Prayer Room",
                description: "Dedicated spaces for prayer and meditation",
                location: "1st Floor, Block A",
                hours: "24/7",
                icon: "🕌"
              },
              {
                title: "ATM & Banking",
                description: "ATM machines and banking services",
                location: "Ground Floor, Main Building",
                hours: "24/7",
                icon: "🏧"
              },
              {
                title: "Medical Center",
                description: "Health services and first aid",
                location: "1st Floor, Block B",
                hours: "8 AM - 6 PM",
                icon: "🏥"
              },
              {
                title: "WiFi Zones",
                description: "High-speed internet access throughout campus",
                location: "All buildings",
                hours: "24/7",
                icon: "📶"
              },
              {
                title: "Parking",
                description: "Secure parking facilities for students",
                location: "Underground & Surface",
                hours: "24/7",
                icon: "🅿️"
              },
              {
                title: "Security",
                description: "24/7 campus security and surveillance",
                location: "All entrances",
                hours: "24/7",
                icon: "🛡️"
              }
            ].map((amenity, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{amenity.title}</h3>
                  <div className="text-3xl">{amenity.icon}</div>
                </div>
                <p className="text-gray-600 mb-4">{amenity.description}</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500"><span className="font-semibold">Location:</span> {amenity.location}</p>
                  <p className="text-sm text-gray-500"><span className="font-semibold">Hours:</span> {amenity.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Amenities;
