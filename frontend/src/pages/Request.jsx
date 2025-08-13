import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Request() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("request");
  const [userData, setUserData] = useState(null);
  const [requestType, setRequestType] = useState("");
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
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
      case "navigation":
        navigate("/navigation");
        break;
      default:
        break;
    }
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!requestType || !requestTitle || !requestDescription) {
      alert('Please fill in all fields');
      return;
    }
    
    console.log('Submitting request:', {
      type: requestType,
      title: requestTitle,
      description: requestDescription,
      user: userData?.name
    });
    
    alert('Request submitted successfully!');
    setRequestType("");
    setRequestTitle("");
    setRequestDescription("");
  };

  const requestTypes = [
    { id: "general", label: "General Inquiry", icon: "❓" },
    { id: "technical", label: "Technical Support", icon: "🛠️" },
    { id: "facility", label: "Facility Request", icon: "🏢" },
    { id: "maintenance", label: "Maintenance", icon: "🔨" },
    { id: "access", label: "Access Request", icon: "🔑" },
    { id: "other", label: "Other", icon: "📝" }
  ];

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
        <Header userData={userData} title="Submit a Request" />

        {/* Main Content Area */}
        <div className="p-8">
          {/* Request Content */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Submit a Request</h2>
            <p className="text-gray-600 mb-6">
              Submit requests for support, facilities, or general inquiries.
            </p>
          </div>

          {/* Request Form */}
          <div className="max-w-2xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/50">
              <form onSubmit={handleSubmitRequest} className="space-y-6">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Request Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {requestTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setRequestType(type.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all text-center ${
                          requestType === type.id
                            ? 'bg-gradient-to-br from-red-400 to-yellow-400 border-orange-500 text-white'
                            : 'border-orange-300 hover:border-orange-400 hover:bg-orange-50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="text-sm font-medium">{type.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Request Title */}
                <div>
                  <label htmlFor="request-title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Request Title
                  </label>
                  <input
                    type="text"
                    id="request-title"
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="Enter a brief title for your request"
                  />
                </div>

                {/* Request Description */}
                <div>
                  <label htmlFor="request-description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Request Description
                  </label>
                  <textarea
                    id="request-description"
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Please provide detailed information about your request..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-br from-red-400 to-yellow-400 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-red-500 hover:to-yellow-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-orange-300"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Request;
