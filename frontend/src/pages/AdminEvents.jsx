import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";

function AdminEvents() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 font-inria">
      <AdminSidebar
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        activeNavItem={"admin_events"}
        onNavClick={(id) => {
          if (id === "admin_home") navigate("/admin-dashboard");
          if (id === "admin_billboards") navigate("/admin/maps");
          if (id === "admin_request") navigate("/admin/request");
        }}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? "ml-70" : "ml-20"}`}>
        <Header title="Admin - Events" />
        <div className="p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Events Management</h2>
            <p className="text-gray-600">Coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEvents;


