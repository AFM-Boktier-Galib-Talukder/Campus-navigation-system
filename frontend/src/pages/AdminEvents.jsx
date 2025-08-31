import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";

function AdminEvents() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("admin_events");
  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    date: "",
    time: "",
    description: "",
    hostedBy: "",
  });
  const [billboardImage, setBillboardImage] = useState(null);
  const [selectedImageData, setSelectedImageData] = useState(null); // Store selected image info
  const [showImageModal, setShowImageModal] = useState(false);
  const [eventRequests, setEventRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();

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

  // Function to show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  // Fetch event requests when modal opens
  const fetchEventRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await fetch("http://localhost:1490/api/reports");
      if (!response.ok) throw new Error("Failed to fetch requests");
      const data = await response.json();
      // Filter for events type requests that have images
      const eventRequestsWithImages = data.filter(
        (request) => request.type === "events" && request.eventImage
      );
      setEventRequests(eventRequestsWithImages);
    } catch (error) {
      showNotification("Failed to load event requests", "error");
      setEventRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Handle opening image selection modal
  const handleChooseFile = () => {
    setShowImageModal(true);
    fetchEventRequests();
  };

  // Handle image selection from modal
  const handleImageSelection = (request) => {
    setSelectedImageData(request);
    setBillboardImage(request.eventImage); // Store filename for submission
    setShowImageModal(false);
    // Removed notification - only show on successful billboard creation
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Convert uploaded image file to base64 (for direct uploads)
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Convert image from reports collection to base64
  const convertReportImageToBase64 = async (imagePath) => {
    try {
      const response = await fetch(
        `http://localhost:1490/uploads/${imagePath}`
      );
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      throw new Error("Failed to convert image to base64");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.venue ||
      !formData.date ||
      !formData.time ||
      !formData.description ||
      !formData.hostedBy
    ) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (!billboardImage) {
      showNotification(
        "Please select a billboard image from event requests",
        "error"
      );
      return;
    }

    try {
      let imageBase64;

      // Convert selected image to base64
      if (selectedImageData) {
        // Image from reports collection
        imageBase64 = await convertReportImageToBase64(billboardImage);
      } else {
        // Direct file upload (fallback, though we're using reports now)
        imageBase64 = await convertFileToBase64(billboardImage);
      }

      const payload = {
        ...formData,
        imageBase64,
        reportId: selectedImageData?._id, // Include the report ID for deletion
        createdBy: null, // You can set this to admin ID if needed
      };

      const response = await fetch("http://localhost:1490/api/billboards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create billboard");
      }

      showNotification("Billboard created successfully!", "success");

      // Reset form
      setFormData({
        title: "",
        venue: "",
        date: "",
        time: "",
        description: "",
        hostedBy: "",
      });
      setBillboardImage(null);
      setSelectedImageData(null);
    } catch (error) {
      showNotification(error.message || "Something went wrong", "error");
    }
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
        <Header title="Admin - Events & Billboards" />

        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Create Event Billboard
            </h2>
            <p className="text-gray-600">
              Create and manage event billboards that will be displayed to users
              across the campus.
            </p>
          </div>

          {/* Billboard Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Row - Title and Venue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="venue"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Venue Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="Enter venue location"
                    required
                  />
                </div>
              </div>

              {/* Second Row - Date, Time, and Hosted By */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Event Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="hostedBy"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Hosted By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="hostedBy"
                    name="hostedBy"
                    value={formData.hostedBy}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm"
                    placeholder="Organization or person name"
                    required
                  />
                </div>
              </div>

              {/* Third Row - Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Event Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm resize-none"
                  placeholder="Provide detailed information about the event..."
                  required
                />
              </div>

              {/* Fourth Row - Image Upload */}
              {/* Billboard Image Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Billboard Image <span className="text-red-500">*</span>
                </label>
                <div className="w-full">
                  <button
                    type="button"
                    onClick={handleChooseFile}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm hover:bg-orange-50 text-left flex items-center justify-between"
                  >
                    <span className="text-gray-700">
                      {selectedImageData
                        ? `Selected: ${selectedImageData.userName}'s event image`
                        : "Choose from Event Requests"}
                    </span>
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Select an image from event requests submitted by users
                  </p>

                  {/* Image Preview */}
                  {selectedImageData && (
                    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                        Preview - {selectedImageData.title}
                      </div>
                      <div className="p-4">
                        <img
                          src={`http://localhost:1490/uploads/${selectedImageData.eventImage}`}
                          alt="Selected billboard"
                          className="w-full h-48 object-contain bg-gray-100 rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "block";
                          }}
                        />
                        <div className="hidden text-center text-gray-500 text-sm py-8">
                          Image preview not available
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-medium">From:</span>{" "}
                          {selectedImageData.userName} (
                          {selectedImageData.userEmail})
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="inline-flex bg-gradient-to-br from-red-400 to-yellow-400 text-white py-4 px-8 rounded-xl font-semibold text-base hover:from-red-500 hover:to-yellow-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl border border-orange-300"
                >
                  Create Billboard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Image Selection Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowImageModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-orange-200/60 w-[95%] max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Select Event Image
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Click to choose an image from event requests submitted by users
              </p>
            </div>

            <div className="overflow-auto max-h-96">
              {loadingRequests ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-600">Loading event requests...</div>
                </div>
              ) : eventRequests.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-gray-600">
                    No event requests with images found
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          User Name
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Event Title
                        </th>
                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Image File
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventRequests.map((request) => (
                        <tr
                          key={request._id}
                          className="hover:bg-orange-50 transition-colors cursor-pointer"
                          onClick={() => handleImageSelection(request)}
                        >
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800">
                            {request.userName || "Unknown"}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                            {request.userEmail || "N/A"}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800">
                            {request.title}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                            {request.eventImage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminEvents;
