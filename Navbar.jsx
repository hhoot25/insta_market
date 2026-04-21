import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, ShoppingCart, MessageCircle, TrendingUp,
  PlusSquare, Settings, LogOut, Search
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const navItems = [
  { to: "/", icon: Home, label: "Buyer Page" },
  { to: "/dashboard", icon: TrendingUp, label: "Seller Page" },
  { to: "/messages", icon: MessageCircle, label: "Messages" },
  { to: "/cart", icon: ShoppingCart, label: "Cart" },
  { to: "/create", icon: PlusSquare, label: "Sell" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, user } = useApp();
  const { logout } = useAuth();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <>
      <nav className="sidebar">
        <div className="sidebar-logo">
          <Link to="/">
            <span className="logo-mark">IM</span>
            <span className="logo-text">InstaMarket</span>
          </Link>
        </div>

        <div className="sidebar-search">
          <form onSubmit={handleSearch}>
            <div className="search-wrap">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search marketplace"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="sidebar-search-input"
              />
            </div>
          </form>
        </div>

        <div className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} className={`nav-item ${active ? "active" : ""}`}>
                <div className="nav-icon-wrap">
                  <Icon size={22} />
                  {to === "/cart" && cart.length > 0 && (
                    <span className="nav-badge">{cart.length}</span>
                  )}
                </div>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          <Link
            to="/support"
            className={`nav-item ${location.pathname === "/support" ? "active" : ""}`}
          >
            <Settings size={22} />
            <span>Support</span>
          </Link>

          <Link to="/dashboard" className="sidebar-user" title="Go to Seller Page">
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-handle">{user.username}</span>
            </div>
          </Link>

          <button
            className="nav-item"
            onClick={logout}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <LogOut size={22} />
            <span>Log out</span>
          </button>
        </div>
      </nav>

      <nav className="mobile-nav">
        {navItems.map(({ to, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} className={`mobile-nav-item ${active ? "active" : ""}`}>
              <div className="nav-icon-wrap">
                <Icon size={24} />
                {to === "/cart" && cart.length > 0 && (
                  <span className="nav-badge">{cart.length}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}