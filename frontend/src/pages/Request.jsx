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
  const [eventImage, setEventImage] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from location state or fetch from API
  useEffect(() => {
    const fetchUserData = async () => {
      const storedId =
        location.state?.userId ||
        sessionStorage.getItem("userId") ||
        localStorage.getItem("userId");
      if (!storedId) {
        setUserData({ name: "User", email: "user@example.com" });
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:1490/api/signup/${storedId}`
        );
        if (response.ok) {
          const user = await response.json();
          setUserData(user);
        } else {
          setUserData({ name: "User", email: "user@example.com" });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({ name: "User", email: "user@example.com" });
      }
    };

    fetchUserData();
  }, [location.state?.userId]);

  // Function to show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000); // Auto-hide after 4 seconds
  };

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

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!requestType) {
      showNotification("Please select a request type", "error");
      return;
    }
    if (!requestTitle.trim() || !requestDescription.trim()) {
      showNotification("Please fill in request title and description", "error");
      return;
    }

    // Check if image is required for events type
    if (requestType === "events" && !eventImage) {
      showNotification("Please upload an event billboard image", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userData?._id || "");
      formData.append("userName", userData?.name || "");
      formData.append("userEmail", userData?.email || "");
      formData.append("type", requestType);
      formData.append("title", requestTitle.trim());
      formData.append("description", requestDescription.trim());

      // Add image if it's an event type and image is selected
      if (requestType === "events" && eventImage) {
        formData.append("eventImage", eventImage);
      }

      const resp = await fetch("http://localhost:1490/api/reports", {
        method: "POST",
        body: formData, // Use FormData instead of JSON for file uploads
      });

      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error || "Failed to submit request");
      }

      showNotification("Request submitted successfully!", "success");
      setRequestType("");
      setRequestTitle("");
      setRequestDescription("");
      setEventImage(null);
    } catch (err) {
      showNotification(err.message || "Something went wrong", "error");
    }
  };
  const requestTypes = [
    {
      id: "general",
      label: "General Inquiry",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 14h-1.5v-1.5h1.5V16zm1.52-6.23c-.23.44-.66.78-1.12 1.15-.57.45-1.15.91-1.15 1.58V13h-1.5v-.6c0-1.36.96-2.08 1.59-2.59.37-.29.66-.51.8-.78.13-.25.15-.54.04-.86-.17-.52-.69-.88-1.33-.88-.88 0-1.49.52-1.6 1.34l-1.49-.2c.21-1.63 1.56-2.64 3.1-2.64 1.38 0 2.5.72 2.89 1.87.2.6.17 1.19-.13 1.74z" />
        </svg>
      ),
    },
    {
      id: "technical",
      label: "Technical Support",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M19.14 12.94a7 7 0 01-6.2 6.2l-.52 1.56a1 1 0 01-1.9 0l-.52-1.56a7 7 0 01-6.2-6.2l-1.56-.52a1 1 0 010-1.9l1.56-.52a7 7 0 016.2-6.2l.52-1.56a1 1 0 011.9 0l.52 1.56a7 7 0 016.2 6.2l1.56.52a1 1 0 010 1.9l-1.56.52zM12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
    },
    {
      id: "facility",
      label: "Facility Request",
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M3 10l9-7 9 7v9a2 2 0 01-2 2h-5v-6H10v6H5a2 2 0 01-2-2v-9z" />
        </svg>
      ),
    },
    {
      id: "maintenance",
      label: "Update Request",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9H4v-2.515l9.9-9.9a2 2 0 012.828 0z" />
          <path d="M3 16h14v2H3z" />
        </svg>
      ),
    },
    {
      id: "access",
      label: "Feedback",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H8l-4 4v-4H4a2 2 0 01-2-2V5z" />
        </svg>
      ),
    },
    {
      id: "events",
      label: "Events",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
        </svg>
      ),
    },
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
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? "ml-70" : "ml-20"
        }`}
      >
        {/* Header */}
        <Header userData={userData} title="Submit a Request" />

        {/* Main Content Area */}
        <div className="p-8">
          {/* Request Content */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Submit a Request
            </h2>
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
                            ? "bg-gradient-to-br from-red-400 to-yellow-400 border-orange-500 text-white"
                            : "border-orange-300 hover:border-orange-400 hover:bg-orange-50"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center mb-1 ${
                            requestType === type.id
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {type.icon}
                        </div>
                        <div className="text-xs font-medium truncate">
                          {type.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Request Title */}
                <div>
                  <label
                    htmlFor="request-title"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Request Title
                  </label>
                  <input
                    type="text"
                    id="request-title"
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="Enter a brief title for your request"
                    required
                  />
                </div>

                {/* Request Description */}
                <div>
                  <label
                    htmlFor="request-description"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Request Description
                  </label>
                  <textarea
                    id="request-description"
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Please provide detailed information about your request..."
                    required
                  />
                </div>

                {/* Event Image Upload - Only show for Events type */}
                {requestType === "events" && (
                  <div>
                    <label
                      htmlFor="event-image"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Event Billboard Image{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        type="file"
                        id="event-image"
                        accept="image/*"
                        onChange={(e) =>
                          setEventImage(e.target.files[0] || null)
                        }
                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Upload an image of the event billboard (JPG, PNG, etc.)
                      </p>
                    </div>
                  </div>
                )}

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

      {/* Modern Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() =>
                  setNotification({ show: false, message: "", type: "" })
                }
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  notification.type === "success"
                    ? "text-green-500 hover:bg-green-100 focus:ring-green-600"
                    : "text-red-500 hover:bg-red-100 focus:ring-red-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Request;
