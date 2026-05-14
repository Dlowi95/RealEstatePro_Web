import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const { isAdmin, authAxios } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoting, setPromoting] = useState(null);

  const fetchAdminData = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      const client = await authAxios();
      const [usersRes, statsRes] = await Promise.all([
        client.get("/api/admin/users"),
        client.get("/api/admin/stats"),
      ]);
      setUsers(usersRes.data.users || []);
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      const message =
        err.response?.data?.message || err.message || "Unable to load admin data";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [authAxios, isAdmin]);

  const handlePromote = async (userId) => {
    setPromoting(userId);
    try {
      const client = await authAxios();
      await client.post("/api/admin/promote", { userId });
      await fetchAdminData(); // Refresh data
    } catch (err) {
      console.error("Promote error:", err);
      setError("Failed to promote user");
    } finally {
      setPromoting(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (!isAdmin) {
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div style={{ marginTop: "24px", padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          
          <h2>Admin Dashboard</h2>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stats && (
        <div style={{ marginBottom: "16px" }}>
          <p>Total users: {stats.totalUsers}</p>
          <p>Admins: {stats.adminCount}</p>
          <p>Users: {stats.userCount}</p>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>
              Full Name
            </th>
            <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>
              Email
            </th>
            <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>
              Role
            </th>
            <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{user.fullName}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{user.email}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{user.role}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                {user.role !== "admin" && (
                  <button
                    onClick={() => handlePromote(user._id)}
                    disabled={promoting === user._id}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: promoting === user._id ? "not-allowed" : "pointer"
                    }}
                  >
                    {promoting === user._id ? "Promoting..." : "Make Admin"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
