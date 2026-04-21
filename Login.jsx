import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!captchaChecked) {
      setError("Please complete the CAPTCHA check.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const result = login(email.trim(), password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    if (result.user.isMeta) navigate("/support");
    else navigate("/");
  };

  const demoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setCaptchaChecked(true);

    await new Promise((r) => setTimeout(r, 100));

    const result = login(demoEmail, "demo1234");
    if (result.ok) {
      if (result.user.isMeta) navigate("/support");
      else navigate("/");
    }
  };

  return (
    <div className="login-root">
      <div className="login-brand">
        <div className="brand-inner">
          <div className="brand-logo-wrap">
            <div className="brand-logo-icon">
              <svg viewBox="0 0 24 24" fill="white" width="40" height="40">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
            <h1 className="brand-name">InstaMarket</h1>
            <p className="brand-tagline">
              Sign in to browse listings, manage your seller page, or access Meta support tools.
            </p>
          </div>

          <div className="brand-phones">
            <div className="phone-mock">
              <div className="phone-screen">
                <div
                  className="phone-img"
                  style={{
                    background:
                      "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                  }}
                />
                <div
                  className="phone-img"
                  style={{
                    background:
                      "linear-gradient(135deg, #0095f6, #833ab4)",
                  }}
                />
                <div
                  className="phone-img"
                  style={{
                    background:
                      "linear-gradient(135deg, #fcb045, #fd1d1d)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-box">
          <div className="login-logo">
            <span>InstaMarket</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              className="ig-input"
              type="email"
              placeholder="Phone number, username, or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <input
              className="ig-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.92rem",
                color: "var(--text-muted)",
                marginTop: "6px",
              }}
            >
              <input
                type="checkbox"
                checked={captchaChecked}
                onChange={(e) => setCaptchaChecked(e.target.checked)}
              />
              I'm not a robot
            </label>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : "Log in"}
            </button>
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <div className="demo-logins">
            <p className="demo-label">Authorized demo accounts</p>

            <button
              type="button"
              className="demo-btn"
              onClick={() => demoLogin("abc123@gmail.com")}
            >
              <span className="demo-icon">🛍️</span>
              <span>
                <strong>Buyer Account</strong>
                <small>abc123@gmail.com</small>
              </span>
            </button>

            <button
              type="button"
              className="demo-btn meta"
              onClick={() => demoLogin("abc123@meta.com")}
            >
              <span className="demo-icon">🛡️</span>
              <span>
                <strong>Meta Support Account</strong>
                <small>abc123@meta.com</small>
              </span>
              <span className="meta-badge">META</span>
            </button>
          </div>

          <button
            className="text-link"
            style={{ marginTop: "14px" }}
            onClick={() => alert("Password reset flow is not implemented yet.")}
            type="button"
          >
            Forgot password?
          </button>
        </div>

        <div className="login-footer-box">
          Don&apos;t have an account?{" "}
          <button
            className="text-link"
            onClick={() => navigate("/signup")}
            type="button"
          >
            Sign up
          </button>
        </div>

        <p className="login-footer-note">© 2025 InstaMarket · from Meta</p>
      </div>
    </div>
  );
}