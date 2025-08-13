import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdminSidebar from "../components/AdminSidebar";

function AdminMaps() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [imageBase64, setImageBase64] = useState("");
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageBase64 || !venue.trim() || !date || !time || !title.trim() || !description.trim()) {
      alert("Please fill all fields and upload an image");
      return;
    }
    try {
      const createdBy = sessionStorage.getItem("userId") || localStorage.getItem("userId") || null;
      const resp = await fetch("http://localhost:1490/api/billboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, title: title.trim(), venue: venue.trim(), date, time, description: description.trim(), createdBy }),
      });
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error || "Failed to create billboard");
      }
      alert("Billboard created");
      setImageBase64("");
      setTitle("");
      setVenue("");
      setDate("");
      setTime("");
      setDescription("");
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 font-inria">
      <AdminSidebar
        isExpanded={isSidebarExpanded}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        activeNavItem={"admin_billboards"}
        onNavClick={(id) => {
          if (id === "admin_home") navigate("/admin-dashboard");
          if (id === "admin_events") navigate("/admin/events");
          if (id === "admin_request") navigate("/admin/request");
        }}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? "ml-70" : "ml-20"}`}>
        <Header title="Admin - Billboards" />
        <div className="p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Billboard</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Billboard Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-700" />
                {imageBase64 && (
                  <div className="mt-3">
                    <img src={imageBase64} alt="preview" className="max-h-48 rounded-lg shadow" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
                  <input value={venue} onChange={(e)=>setVenue(e.target.value)} className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80" placeholder="Location" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                    <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80" placeholder="Event title" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={5} className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white/80" placeholder="Short description" />
              </div>
              <div className="flex justify-center">
                <button type="submit" className="inline-flex bg-gradient-to-br from-red-400 to-yellow-400 text-white py-3 px-6 rounded-xl font-semibold text-base hover:from-red-500 hover:to-yellow-500 transition-colors shadow-lg border border-orange-300">Save Billboard</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMaps;


