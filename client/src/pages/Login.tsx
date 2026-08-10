import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../http/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { userEmail, userPassword });
      login(res.data.data, res.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-3xl font-bold text-heading">Login</h1>
        <p className="mt-1 text-sm text-text-muted">Welcome back — sign in to continue</p>

        {error && <p className="mt-4 text-sm text-error">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-input px-4 py-2 text-text placeholder:text-text-dim focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-input px-4 py-2 text-text placeholder:text-text-dim focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary-hover active:bg-primary-active disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-text-muted">
          No account?{" "}
          <Link to="/register" className="text-link hover:text-link-hover">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
