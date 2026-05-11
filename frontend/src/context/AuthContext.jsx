import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { getToken, isSignedIn, userId } = useAuth();
  const [user, setUser] = useState(null);       // thông tin user từ DB của mình
  const [role, setRole] = useState(null);        // "user" | "admin"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    // Khi Clerk đăng nhập xong → lấy JWT rồi gửi lên backend để đồng bộ user
    const syncUser = async () => {
      try {
        const token = await getToken();  // JWT từ Clerk
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/sync`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data.user);
        setRole(res.data.user.role);  // "user" hoặc "admin"
      } catch (err) {
        console.error("Sync user failed:", err);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [isSignedIn, userId]);

  // Hàm helper: gọi API có kèm JWT tự động
  const authAxios = async () => {
    const token = await getToken();
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const isAdmin = role === "admin";

  return (
    <AuthContext.Provider value={{ user, role, loading, isAdmin, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}