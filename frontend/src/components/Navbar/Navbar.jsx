import { Link, useNavigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/clerk-react";
import { useAuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuthContext();
  const { openSignIn } = useClerk();

  const navLinks = [
    { label: "Mua bán", path: "/listings?type=sale" },
    { label: "Cho thuê", path: "/listings?type=rent" },
    { label: "Dự án", path: "/listings?type=project" },
    { label: "Tin tức", path: "/news" },
  ];

  return (
    <nav className="navbar">
      {/* TOP BAR */}
      <div className="navbar-top">
        <div className="container">
          <Link to="/" className="navbar-logo">
            Real<span>Estate</span>Pro
          </Link>

          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname + location.search === link.path ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <SignedOut>
              <button className="btn-ghost" onClick={() => openSignIn()}>
                Đăng nhập
              </button>
              <Link to="/register" className="btn-primary">
                Đăng ký
              </Link>
            </SignedOut>

            <SignedIn>
              {isAdmin && (
                <Link to="/admin" className="btn-admin">
                  ⚙️ Admin
                </Link>
              )}
              <Link to="/dashboard" className="btn-ghost">
                Tin của tôi
              </Link>
              {/* Avatar + menu từ Clerk */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <Link to="/post" className="btn-post">
              + Đăng tin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}