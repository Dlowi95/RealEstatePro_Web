import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthContext } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminSettings from "./pages/admin/AdminSettings";
import HomePage from "./pages/users/HomePage";
import SellPropertiesPage from "./pages/users/SellPropertiesPage";
import RentPropertiesPage from "./pages/users/RentPropertiesPage";
import CreatePropertyPage from "./pages/users/CreatePropertyPage";
import ManagePropertiesPage from "./pages/users/ManagePropertyPage";
import EditPropertyPage from "./pages/users/UpdatePropertyPage";
import UserLayout from "./layouts/UserLayout";

// Bảo vệ route admin: chỉ admin mới vào được
function AdminRoute({ children }) {
  const { loading, isAdmin } = useAuthContext();
  if (loading) return <div>Loading...</div>;
  return isAdmin ? children : <Navigate to="/" replace />;
}

// Tự động chuyển admin từ "/" sang "/admin"
function AdminRedirector() {
  const { loading, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAdmin && location.pathname === "/") {
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
        {/* User routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/ban" element={<UserLayout><SellPropertiesPage /></UserLayout>} />
        <Route path="/cho-thue" element={<UserLayout><RentPropertiesPage /></UserLayout>} />
        <Route path="/create-property" element={<UserLayout><CreatePropertyPage /></UserLayout>} />
        <Route path="/manage-properties" element={<UserLayout><ManagePropertiesPage /></UserLayout>} />
        <Route path="/edit-property/:id" element={<UserLayout><EditPropertyPage /></UserLayout>} />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="stats" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;