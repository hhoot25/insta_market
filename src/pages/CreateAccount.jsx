import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function CreateAccount() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    contact: "",
    password: "",
    birthdate: "",
  });
  const [error, setError] = useState("");

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.contact.trim() ||
      !form.password.trim() ||
      !form.birthdate
    ) {
      setError("Please fill in all fields.");
      return;
    }

    register(form);
    navigate("/login");
  };

  return (
    <div className="login-root">
      <div className="login-brand">
        <div className="brand-inner">
          <div className="brand-logo-wrap">
            <div className="brand-logo-icon">
              <svg viewBox="0 0 24 24" fill="white" width="40" height="40">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
              </svg>
            </div>
            <h1 className="brand-name">InstaMarket</h1>
            <p className="brand-tagline">
              Create an account and start buying, selling, and browsing listings.
            </p>
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
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <input
              className="ig-input"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
            />
            <input
              className="ig-input"
              type="text"
              placeholder="Phone number or email"
              value={form.contact}
              onChange={(e) => updateField("contact", e.target.value)}
            />
            <input
              className="ig-input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
            <input
              className="ig-input"
              type="date"
              value={form.birthdate}
              onChange={(e) => updateField("birthdate", e.target.value)}
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-btn">
              Sign up
            </button>
          </form>
        </div>

        <div className="login-footer-box">
          Already have an account?{" "}
          <button className="text-link" onClick={() => navigate("/")}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}