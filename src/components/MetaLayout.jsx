import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Shield, MessageSquare, LogOut, ChevronRight, Home, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FraudDashboard from "../pages/FraudDashboard";
import ComplaintsDashboard from "../pages/ComplaintsDashboard";
import "./MetaLayout.css";

export default function MetaLayout() {
  const { authUser, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/meta/fraud", icon: Shield, label: "Fraud Detection" },
    { to: "/meta/complaints", icon: MessageSquare, label: "User Complaints" },
  ];

  return (
    <div className="meta-shell">
      {/* Meta sidebar */}
      <aside className="meta-sidebar">
        <div className="meta-sidebar-brand">
          <div className="meta-brand-logo">
            <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </div>
          <div>
            <p className="meta-brand-name">InstaMarket</p>
            <p className="meta-brand-sub">Trust & Safety</p>
          </div>
        </div>

        <div className="meta-employee-card">
          <div className="mec-avatar">{authUser?.name?.charAt(0) || "M"}</div>
          <div className="mec-info">
            <p className="mec-name">{authUser?.name}</p>
            <p className="mec-email">{authUser?.email}</p>
          </div>
        </div>

        <nav className="meta-nav">
          <p className="meta-nav-section">Operations</p>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link key={to} to={to} className={`meta-nav-item ${active ? "active" : ""}`}>
                <Icon size={17} />
                <span>{label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.5 }} />}
              </Link>
            );
          })}
        </nav>

        <div className="meta-sidebar-bottom">
          <button className="meta-logout-btn" onClick={logout}>
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Meta top bar */}
      <div className="meta-content">
        <header className="meta-topbar">
          <div className="meta-topbar-left">
            <div className="meta-env-badge">INTERNAL · CONFIDENTIAL</div>
          </div>
          <div className="meta-topbar-right">
            <button className="meta-notif-btn">
              <Bell size={16} />
              <span className="notif-dot" />
            </button>
          </div>
        </header>

        <main className="meta-main">
          <Routes>
            <Route path="fraud" element={<FraudDashboard />} />
            <Route path="complaints" element={<ComplaintsDashboard />} />
            <Route path="*" element={<FraudDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
