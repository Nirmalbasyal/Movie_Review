import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../http/api";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/register", { userName, userEmail, userPassword });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-3xl font-bold text-heading">Register</h1>
        <p className="mt-1 text-sm text-text-muted">Create an account to start reviewing</p>

        {error && <p className="mt-4 text-sm text-error">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-input px-4 py-2 text-text placeholder:text-text-dim focus:border-primary focus:outline-none"
          />
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-text-muted">
          Have an account?{" "}
          <Link to="/login" className="text-link hover:text-link-hover">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
