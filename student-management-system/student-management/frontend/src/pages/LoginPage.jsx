import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "Admin",   email: "admin@school.com",  role: "admin" },
  { label: "Teacher", email: "ramesh@school.com", role: "teacher" },
  { label: "Student", email: "arjun@school.com",  role: "student" },
];

const LoginPage = () => {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword("password123");
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🏫 EduManage</h1>
        <p>Sign in to your account to continue</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-control"
              type="email"
              placeholder="you@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="demo-accounts">
          <h4>Demo Accounts (password: password123)</h4>
          {DEMO_ACCOUNTS.map((acc) => (
            <div className="demo-account" key={acc.email}>
              <div>
                <strong>{acc.label}</strong> — {acc.email}
              </div>
              <button className="demo-btn" onClick={() => fillDemo(acc)}>
                Fill
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
