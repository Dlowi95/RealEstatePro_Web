import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/clerk-react";
import { useAuthContext } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomePage from "./pages/users/HomePage";
import CreatePropertyPage from "./pages/users/CreatePropertyPage";
import ManagePropertiesPage from "./pages/users/ManagePropertyPage";
import EditPropertyPage from "./pages/users/UpdatePropertyPage";

function AdminPage() {
  const { loading, isAdmin } = useAuthContext();

  console.log("[AdminPage] loading:", loading, "isAdmin:", isAdmin);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
}

function AdminRedirector() {
  const { loading, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAdmin && location.pathname === "/") {
      console.log("[AdminRedirector] detected admin, redirecting to /admin");
      navigate("/admin", { replace: true });
    }
  }, [loading, isAdmin, location.pathname, navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AdminRedirector />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/create-property" element={<CreatePropertyPage />} />
        <Route path="/manage-properties" element={<ManagePropertiesPage />} />
        <Route path="/edit-property/:id" element={<EditPropertyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;