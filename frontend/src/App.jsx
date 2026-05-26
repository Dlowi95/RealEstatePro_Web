import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminStats from "./pages/admin/AdminStats";
import HomePage from "./pages/users/HomePage";
import SellPropertiesPage from "./pages/users/SellPropertiesPage";
import RentPropertiesPage from "./pages/users/RentPropertiesPage";
import CreatePropertyPage from "./pages/users/CreatePropertyPage";
import ManagePropertiesPage from "./pages/users/ManagePropertyPage";
import EditPropertyPage from "./pages/users/UpdatePropertyPage";

import UserLayout from "./layouts/UserLayout";
import PropertyDetailsPage from "./pages/users/PropertyDetailsPage";
import FavoritePropertiesPage from "./pages/users/FavoritePropertiesPage";

function AuthMonitor({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const currentPath = window.location.pathname;
      
      const publicPaths = ["/", "/sell", "/rent"];
      
      const isPublic = publicPaths.some(path => currentPath === path) || currentPath.startsWith("/property/");
      
      if (!isPublic) {
        navigate("/", { replace: true });
      }
    }
  }, [isSignedIn, isLoaded, navigate]);

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthMonitor>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sell" element={<UserLayout><SellPropertiesPage /></UserLayout>} />
          <Route path="/rent" element={<UserLayout><RentPropertiesPage /></UserLayout>} />
          <Route path="/create-property" element={<UserLayout><CreatePropertyPage /></UserLayout>} />
          <Route path="/manage-properties" element={<UserLayout><ManagePropertiesPage /></UserLayout>} />
          <Route path="/edit-property/:id" element={<UserLayout><EditPropertyPage /></UserLayout>} />
          <Route path="/favorites" element={<UserLayout><FavoritePropertiesPage /></UserLayout>} />
          <Route path="/property/:id" element={<UserLayout><PropertyDetailsPage /></UserLayout>} />

          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthMonitor>
    </BrowserRouter>
  );
}

export default App;