import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";

function AdminRequests() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("admin_request");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const resp = await fetch("http://localhost:1490/api/reports");
        if (!resp.ok) throw new Error("Failed to load reports");
        const data = await resp.json();
        setReports(Array.isArray(data) ? data : []);
      } catch (_) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const closeModal = () => setSelectedReport(null);

  const handleDelete = async (reportId) => {
    try {
      await fetch(`http://localhost:1490/api/reports/${reportId}`, {
        method: "DELETE",
      });
      setReports((prev) => prev.filter((r) => (r?._id || r?.id) !== reportId));
    } catch (_) {
      // intentionally no notification per requirements
    } finally {
      closeModal();
    }
  };

  const prettyType = (t) => {
    if (!t) return "";
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50/90 to-emerald-50/90 font-inria">
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
        <Header title="Admin - Requests" />
        <div className="p-8">
          <div className="bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              User Requests
            </h2>
            {loading ? (
              <div className="text-gray-600">Loading...</div>
            ) : reports.length === 0 ? (
              <div className="text-gray-600">No requests found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <button
                    key={report._id || report.id}
                    onClick={() => setSelectedReport(report)}
                    className="group text-left w-full bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-5 shadow hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-700 font-semibold truncate">
                          {report.userName || "Unknown User"}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {report.userEmail || "N/A"}
                        </div>
                        <div className="mt-2 text-xs font-medium text-green-600">
                          {prettyType(report.type)}
                        </div>
                        <div className="mt-1 text-base font-bold text-gray-800 line-clamp-2">
                          {report.title}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
          <div className="relative bg-gradient-to-br from-green-50/95 to-emerald-50/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-200/60 w-[92%] max-w-2xl p-6">
            <div className="pr-2">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Request Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold w-36 text-gray-700">
                    User Name:
                  </span>
                  <span className="text-gray-800">
                    {selectedReport.userName || "Unknown User"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold w-36 text-gray-700">
                    User Email:
                  </span>
                  <span className="text-gray-800">
                    {selectedReport.userEmail || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold w-36 text-gray-700">
                    Request Type:
                  </span>
                  <span className="text-green-600 font-medium">
                    {prettyType(selectedReport.type)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold w-36 text-gray-700">
                    Request Title:
                  </span>
                  <span className="text-gray-800">{selectedReport.title}</span>
                </div>
                <div className="mt-3">
                  <div className="font-semibold text-gray-700 mb-1">
                    Request Description
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedReport.description}
                  </div>
                </div>

                {/* Event Image - Show only for events type */}
                {selectedReport.type === "events" &&
                  selectedReport.eventImage && (
                    <div className="mt-4">
                      <div className="font-semibold text-gray-700 mb-2">
                        Event Billboard Image
                      </div>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={`http://localhost:1490/uploads/${selectedReport.eventImage}`}
                          alt="Event Billboard"
                          className="w-full h-auto max-h-64 object-contain bg-gray-50"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "block";
                          }}
                        />
                        <div className="hidden p-4 text-center text-gray-500 text-sm">
                          Image not available
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Back
              </button>
              <button
                onClick={() =>
                  handleDelete(selectedReport._id || selectedReport.id)
                }
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequests;
