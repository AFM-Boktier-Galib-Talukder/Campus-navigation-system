import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("admin_home");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = location.state?.userId || localStorage.getItem("userId");
      if (!userId) return;
      try {
        const resp = await fetch(`http://localhost:1490/api/signup/${userId}`);
        if (resp.ok) {
          const user = await resp.json();
          setUserData(user);
        }
      } catch (_) {}
    };
    fetchUserData();
  }, [location.state?.userId]);

  const handleNavClick = (itemId) => {
    setActiveNavItem(itemId);
    switch (itemId) {
      case "admin_home":
        navigate("/admin-dashboard");
        break;
      case "admin_billboards":
        navigate("/admin/maps");
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 font-inria">
      <AdminSidebar
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        activeNavItem={activeNavItem}
        onNavClick={handleNavClick}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? "ml-70" : "ml-20"}`}>
        <Header userData={userData} title="Admin" />
        <div className="p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Admin</h2>
            <p className="text-gray-600">Use the sidebar to manage maps, events, and requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
