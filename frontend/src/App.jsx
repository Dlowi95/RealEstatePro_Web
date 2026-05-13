import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/clerk-react";
import { useAuthContext } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";

function Home() {
  const { user: clerkUser, isLoaded } = useUser();
  const { role, loading, isAdmin } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate('/admin');
    }
  }, [loading, isAdmin, navigate]);

  return (
    <div style={{ padding: "40px" }}>
      <h1>RealEstatePro</h1>

      <SignedOut>
        <button style={{ marginRight: "10px" }}>
          <SignInButton />
        </button>

        <button>
          <SignUpButton />
        </button>
      </SignedOut>

      <SignedIn>
        <div style={{ marginBottom: "18px" }}>
          <p>Welcome, {clerkUser?.fullName || clerkUser?.username}</p>
          <p>Role: {loading ? "Loading..." : role || "user"}</p>
        </div>

        {isAdmin && (
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <button style={{ marginBottom: "18px" }}>
              Open Admin Dashboard
            </button>
          </Link>
        )}

        <UserButton />
      </SignedIn>
    </div>
  );
}

function AdminPage() {
  const { loading, isAdmin } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;