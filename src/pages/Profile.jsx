import { useState } from "react";
import { Star, CheckCircle2, MapPin, Edit2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { users } from "../data/mockData";
import ProductCard from "../components/ProductCard";
import "./Profile.css";

export default function Profile() {
  const { user, listings, favorites } = useApp();
  const [tab, setTab] = useState("listings");

  const myListings = listings.filter((l) => l.sellerId === user.id);
  const favoriteListings = listings.filter((l) => favorites.includes(l.id));

  const stars = Math.round(user.rating);

  return (
    <div className="page profile-page">
      {/* Hero */}
      <div className="profile-hero card">
        <div className="profile-cover" />
        <div className="profile-body">
          <div className="profile-avatar-wrap">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
            {user.verified && (
              <div className="verified-badge">
                <CheckCircle2 size={16} />
              </div>
            )}
          </div>
          <div className="profile-main">
            <div className="profile-name-row">
              <div>
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-handle">{user.username}</p>
              </div>
              <Link to="/create" className="btn btn-secondary" style={{ gap: "6px", fontSize: "0.82rem" }}>
                <Edit2 size={14} /> Edit Profile
              </Link>
            </div>
            <p className="profile-bio">{user.bio}</p>
            <div className="profile-meta">
              <div className="profile-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < stars ? "#d4af37" : "none"} stroke={i < stars ? "#d4af37" : "var(--text-muted)"} />
                ))}
                <span>{user.rating} ({user.reviews} reviews)</span>
              </div>
              <span className="dot-sep">·</span>
              <span className="profile-location"><MapPin size={12} /> {user.location}</span>
              <span className="dot-sep">·</span>
              <span className="profile-joined">Joined {user.joined}</span>
            </div>
            <div className="profile-stats">
              <div className="pstat">
                <span className="pstat-val">{myListings.length}</span>
                <span className="pstat-key">Listings</span>
              </div>
              <div className="pstat">
                <span className="pstat-val">{user.sales}</span>
                <span className="pstat-key">Sales</span>
              </div>
              <div className="pstat">
                <span className="pstat-val">{(user.followers / 1000).toFixed(1)}k</span>
                <span className="pstat-key">Followers</span>
              </div>
              <div className="pstat">
                <span className="pstat-val">{favorites.length}</span>
                <span className="pstat-key">Saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${tab === "listings" ? "active" : ""}`}
          onClick={() => setTab("listings")}
        >
          Listings ({myListings.length})
        </button>
        <button
          className={`profile-tab ${tab === "saved" ? "active" : ""}`}
          onClick={() => setTab("saved")}
        >
          <Heart size={14} /> Saved ({favoriteListings.length})
        </button>
      </div>

      {/* Grid */}
      {tab === "listings" ? (
        myListings.length > 0 ? (
          <div className="product-grid">
            {myListings.map((l) => <ProductCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="empty-state">
            <p>No listings yet.</p>
            <Link to="/create" className="btn btn-primary">Create First Listing</Link>
          </div>
        )
      ) : (
        favoriteListings.length > 0 ? (
          <div className="product-grid">
            {favoriteListings.map((l) => <ProductCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="empty-state">
            <Heart size={36} style={{ color: "var(--text-muted)" }} />
            <p>Nothing saved yet. Heart items to save them.</p>
            <Link to="/" className="btn btn-secondary">Browse Listings</Link>
          </div>
        )
      )}
    </div>
  );
}
