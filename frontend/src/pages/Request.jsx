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
      const storedId = location.state?.userId || sessionStorage.getItem("userId") || localStorage.getItem("userId");
      if (!storedId) {
        setUserData({ name: "User", email: "user@example.com" });
        return;
      }
      try {
        const response = await fetch(`http://localhost:1490/api/signup/${storedId}`);
        if (response.ok) {
          const user = await response.json();
          setUserData(user);
        } else {
          setUserData({ name: "User", email: "user@example.com" });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData({ name: "User", email: "user@example.com" });
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

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!requestType) {
      alert('Please select a request type');
      return;
    }
    if (!requestTitle.trim() || !requestDescription.trim()) {
      alert('Please fill in request title and description');
      return;
    }
    try {
      const payload = {
        userId: userData?._id || null,
        userName: userData?.name || null,
        userEmail: userData?.email || null,
        type: requestType,
        title: requestTitle.trim(),
        description: requestDescription.trim(),
      };
      const resp = await fetch('http://localhost:1490/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error || 'Failed to submit request');
      }
      alert('Request submitted successfully!');
      setRequestType("");
      setRequestTitle("");
      setRequestDescription("");
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };

  const requestTypes = [
    {
      id: "general",
      label: "General Inquiry",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 14h-1.5v-1.5h1.5V16zm1.52-6.23c-.23.44-.66.78-1.12 1.15-.57.45-1.15.91-1.15 1.58V13h-1.5v-.6c0-1.36.96-2.08 1.59-2.59.37-.29.66-.51.8-.78.13-.25.15-.54.04-.86-.17-.52-.69-.88-1.33-.88-.88 0-1.49.52-1.6 1.34l-1.49-.2c.21-1.63 1.56-2.64 3.1-2.64 1.38 0 2.5.72 2.89 1.87.2.6.17 1.19-.13 1.74z"/>
        </svg>
      )
    },
    {
      id: "technical",
      label: "Technical Support",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M19.14 12.94a7 7 0 01-6.2 6.2l-.52 1.56a1 1 0 01-1.9 0l-.52-1.56a7 7 0 01-6.2-6.2l-1.56-.52a1 1 0 010-1.9l1.56-.52a7 7 0 016.2-6.2l.52-1.56a1 1 0 011.9 0l.52 1.56a7 7 0 016.2 6.2l1.56.52a1 1 0 010 1.9l-1.56.52zM12 8a4 4 0 100 8 4 4 0 000-8z"/>
        </svg>
      )
    },
    {
      id: "facility",
      label: "Facility Request",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M3 10l9-7 9 7v9a2 2 0 01-2 2h-5v-6H10v6H5a2 2 0 01-2-2v-9z"/>
        </svg>
      )
    },
    {
      id: "maintenance",
      label: "Update Request",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9H4v-2.515l9.9-9.9a2 2 0 012.828 0z" />
          <path d="M3 16h14v2H3z" />
        </svg>
      )
    },
    {
      id: "access",
      label: "Feedback",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H8l-4 4v-4H4a2 2 0 01-2-2V5z" />
        </svg>
      )
    },
    {
      id: "other",
      label: "Others",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      )
    }
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

          {/* Request Form - full width */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/50">
              <form onSubmit={handleSubmitRequest} className="space-y-6">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Request Type
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {requestTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setRequestType(type.id)}
                        className={`p-2 border-2 rounded-xl cursor-pointer transition-all text-center select-none ${
                          requestType === type.id
                            ? 'bg-gradient-to-br from-red-400 to-yellow-400 border-orange-500 text-white'
                            : 'border-orange-300 hover:border-orange-400 hover:bg-orange-50'
                        }`}
                      >
                        <div className={`flex items-center justify-center mb-1 ${requestType === type.id ? 'text-white' : 'text-gray-700'}`}>{type.icon}</div>
                        <div className="text-xs font-medium truncate">{type.label}</div>
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
                    required
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
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="inline-flex bg-gradient-to-br from-red-400 to-yellow-400 text-white py-3 px-6 rounded-xl font-semibold text-base hover:from-red-500 hover:to-yellow-500 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl border border-orange-300"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Request;
