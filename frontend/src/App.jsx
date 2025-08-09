import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Homepage from "./pages/HomePage";
import FacultyDesk from "./pages/FacultyDesk";
import Library from "./pages/Library";
import Amenities from "./pages/Amenities";
import Request from "./pages/Request";
import AdminDashboard from "./pages/AdminDashboard";
import Navigation from "./pages/Navigation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/faculty-desk" element={<FacultyDesk />} />
        <Route path="/library" element={<Library />} />
        <Route path="/amenities" element={<Amenities />} />
        <Route path="/request" element={<Request />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/navigation" element={<Navigation />} />
      </Routes>
    </Router>
  );
}

export default App;
