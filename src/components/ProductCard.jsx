import { Heart, Flag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { users, categories } from "../data/mockData";
import "./ProductCard.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80";

export default function ProductCard({ listing }) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useApp();
  const isFav = favorites.includes(listing.id);
  const seller = users.find((u) => u.id === listing.sellerId);

  const conditionClass = {
    New: "badge-new",
    "Like New": "badge-like-new",
    Excellent: "badge-like-new",
    "Very Good": "badge-good",
    Good: "badge-good",
  }[listing.condition] || "badge-new";

  const categoryLabel =
    categories.find((cat) => cat.id === listing.category)?.label || listing.category;

  const displayImage =
    listing.images?.[0] && listing.images[0].trim() ? listing.images[0] : FALLBACK_IMAGE;

  const handleReport = (e) => {
    e.preventDefault();
    navigate(
      `/support?listingId=${listing.id}&title=${encodeURIComponent(
        listing.title
      )}&seller=${encodeURIComponent(seller?.username || "unknown seller")}`
    );
  };

  return (
    <div className={`product-card card fade-in ${listing.sold ? "sold" : ""}`}>
      <Link to={`/product/${listing.id}`} className="product-image-wrap">
        <img
          src={displayImage}
          alt={listing.title}
          className="product-img"
          loading="lazy"
        />

        {listing.sold && (
          <div className="sold-overlay">
            <span>Sold</span>
          </div>
        )}

        <div className="product-badges">
          <span className={`badge ${conditionClass}`}>{listing.condition}</span>
        </div>

        <button
          className={`fav-btn ${isFav ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(listing.id);
          }}
          aria-label="Toggle favorite"
        >
          <Heart size={16} fill={isFav ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="product-info">
        <div className="product-price-row">
          <span className="product-price">${listing.price.toLocaleString()}</span>
          {listing.originalPrice && (
            <span className="product-original">
              ${listing.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <Link to={`/product/${listing.id}`}>
          <p className="product-title">{listing.title}</p>
        </Link>

        <p className="product-category">{categoryLabel}</p>

        {seller && (
          <Link to="/dashboard" className="product-seller">
            <img src={seller.avatar} alt={seller.name} />
            <span>{seller.name}</span>
          </Link>
        )}

        <button
          type="button"
          onClick={handleReport}
          className="btn btn-secondary product-report-btn"
        >
          <Flag size={14} />
          Report Listing
        </button>
      </div>
    </div>
  );
}