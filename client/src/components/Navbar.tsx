import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-navbar/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-bg">🎬</span>
          <span className="text-heading">
            Movie<span className="text-gold">Review</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <Link
            to="/"
            className={`border-b-2 pb-1 transition ${
              isActive("/") ? "border-gold text-heading" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Movies
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/add-movie"
              className={`border-b-2 pb-1 transition ${
                isActive("/add-movie")
                  ? "border-gold text-heading"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              Add Movie
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-text-muted sm:inline">Hi, {user.userName}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-card"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-link hover:text-link-hover">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover active:bg-primary-active"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
