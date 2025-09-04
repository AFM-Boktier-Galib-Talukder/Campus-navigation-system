import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider } from "./components/SessionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Homepage from "./pages/HomePage";
import FacultyDesk from "./pages/FacultyDesk";
import Library from "./pages/Library";
import Amenities from "./pages/Amenities";
import Request from "./pages/Request";
import AdminDashboard from "./pages/AdminDashboard";
import Navigation from "./pages/Navigation";
import LandingPage from "./pages/LandingPage";
import AdminEvents from "./pages/AdminEvents";
import AdminRequests from "./pages/AdminRequests";

function App() {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/landingPage" replace />} />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/homepage"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty-desk"
            element={
              <ProtectedRoute>
                <FacultyDesk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/amenities"
            element={
              <ProtectedRoute>
                <Amenities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request"
            element={
              <ProtectedRoute>
                <Request />
              </ProtectedRoute>
            }
          />
          <Route
            path="/navigation"
            element={
              <ProtectedRoute>
                <Navigation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/request"
            element={
              <ProtectedRoute>
                <AdminRequests />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </SessionProvider>
  );
}

export default App;
