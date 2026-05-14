import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CataloguePage from "./pages/CataloguePage";
import ReservationsPage from "./pages/ReservationsPage";

export default function App() {
  const { user } = useAuth();

  // Not logged in → show login page
  if (!user) {
    return <LoginPage />;
  }

  // Admin → show admin dashboard (no Navbar/Footer)
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  // Client → show public site with Navbar/Footer
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
