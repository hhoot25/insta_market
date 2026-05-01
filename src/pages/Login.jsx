import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // ── Login submit ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Please enter your email and password.");
      return;
    }
    setLoginLoading(true);
    await new Promise(r => setTimeout(r, 700));
    login(loginEmail.trim(), loginPassword);
    setLoginLoading(false);
  };

  // ── Signup submit ──
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    if (!signupName.trim()) { setSignupError("Please enter your name."); return; }
    if (!signupEmail.trim()) { setSignupError("Please enter your email."); return; }
    if (signupPassword.length < 6) { setSignupError("Password must be at least 6 characters."); return; }
    if (signupPassword !== signupConfirm) { setSignupError("Passwords do not match."); return; }
    setSignupLoading(true);
    await new Promise(r => setTimeout(r, 900));
    signup(signupName, signupEmail.trim(), signupPassword);
    setSignupLoading(false);
  };

  // ── Demo login ──
  const demoLogin = (email) => {
    login(email, "demo1234");
  };

  return (
    <div className="login-root">

      {/* Left brand panel */}
      <div className="login-brand">
        <div className="brand-inner">
          <div className="brand-logo-wrap">
            <div className="brand-logo-icon">
              <svg viewBox="0 0 24 24" fill="white" width="40" height="40">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <h1 className="brand-name">InstaMarket</h1>
            <p className="brand-tagline">Buy, sell, and discover unique items from people in your community.</p>
          </div>
          <div className="phone-mock">
            <div className="phone-screen">
              <div className="phone-img" style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }} />
              <div className="phone-img" style={{ background: "linear-gradient(135deg, #0095f6, #833ab4)" }} />
              <div className="phone-img" style={{ background: "linear-gradient(135deg, #fcb045, #fd1d1d)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-panel">
        <div className="login-box">

          {/* Logo */}
          <div className="login-logo">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <defs>
                <linearGradient id="lg" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#f09433"/>
                  <stop offset="25%"  stopColor="#e6683c"/>
                  <stop offset="50%"  stopColor="#dc2743"/>
                  <stop offset="75%"  stopColor="#cc2366"/>
                  <stop offset="100%" stopColor="#bc1888"/>
                </linearGradient>
              </defs>
              <path fill="url(#lg)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <span>InstaMarket</span>
          </div>

          {/* Mode tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => { setMode("login"); setLoginError(""); setSignupError(""); }}
            >
              Log In
            </button>
            <button
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => { setMode("signup"); setLoginError(""); setSignupError(""); }}
            >
              Sign Up
            </button>
          </div>

          {/* ── LOGIN FORM ── */}
          {mode === "login" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <input
                className="ig-input"
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                className="ig-input"
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                autoComplete="current-password"
              />
              {loginError && <p className="auth-error">{loginError}</p>}
              <button type="submit" className="auth-submit-btn" disabled={loginLoading}>
                {loginLoading ? <span className="spinner" /> : "Log In"}
              </button>
              <button type="button" className="forgot-btn">Forgot password?</button>
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {mode === "signup" && (
            <form className="auth-form" onSubmit={handleSignup}>
              <input
                className="ig-input"
                type="text"
                placeholder="Full Name"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                autoComplete="name"
              />
              <input
                className="ig-input"
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                className="ig-input"
                type="password"
                placeholder="Password (min. 6 characters)"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                autoComplete="new-password"
              />
              <input
                className="ig-input"
                type="password"
                placeholder="Confirm Password"
                value={signupConfirm}
                onChange={e => setSignupConfirm(e.target.value)}
                autoComplete="new-password"
              />
              {signupError && <p className="auth-error">{signupError}</p>}
              <button type="submit" className="auth-submit-btn" disabled={signupLoading}>
                {signupLoading ? <span className="spinner" /> : "Create Account"}
              </button>
              <p className="signup-tos-notice">
                By signing up you'll be asked to review and accept our Terms of Service.
              </p>
            </form>
          )}

          {/* Divider + demo buttons (login only) */}
          {mode === "login" && (
            <>
              <div className="login-divider"><span>OR</span></div>
              <div className="demo-logins">
                <p className="demo-label">Try a demo account</p>
                <button className="demo-btn" onClick={() => demoLogin("sofia@shoppers.com")}>
                  <span className="demo-icon">🛍️</span>
                  <span>
                    <strong>Buyer / Seller</strong>
                    <small>sofia@shoppers.com</small>
                  </span>
                </button>
                <button className="demo-btn meta" onClick={() => demoLogin("trust.safety@meta.com")}>
                  <span className="demo-icon">🔒</span>
                  <span>
                    <strong>Meta Employee</strong>
                    <small>trust.safety@meta.com</small>
                  </span>
                  <span className="meta-badge">META</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom switch */}
        <div className="login-footer-box">
          {mode === "login" ? (
            <>Don't have an account?{" "}
              <button className="text-link" onClick={() => setMode("signup")}>Sign up</button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button className="text-link" onClick={() => setMode("login")}>Log in</button>
            </>
          )}
        </div>

        <p className="login-footer-note">© 2025 InstaMarket · from Meta</p>
      </div>
    </div>
  );
}
