import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { users } from "../data/mockData";
import "./ProductCard.css";

export default function ProductCard({ listing }) {
  const { favorites, toggleFavorite, addToCart } = useApp();
  const isFav = favorites.includes(listing.id);
  const seller = users.find((u) => u.id === listing.sellerId);

  const conditionClass = {
    "New": "badge-new",
    "Like New": "badge-like-new",
    "Excellent": "badge-like-new",
    "Very Good": "badge-good",
    "Good": "badge-good",
  }[listing.condition] || "badge-new";

  return (
    <div className={`product-card card fade-in ${listing.sold ? "sold" : ""}`}>
      <Link to={`/product/${listing.id}`} className="product-image-wrap">
        <img src={listing.images[0]} alt={listing.title} className="product-img" loading="lazy" />
        {listing.sold && <div className="sold-overlay"><span>Sold</span></div>}
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
            <span className="product-original">${listing.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <Link to={`/product/${listing.id}`}>
          <p className="product-title">{listing.title}</p>
        </Link>
        {seller && (
          <Link to={`/profile`} className="product-seller">
            <img src={seller.avatar} alt={seller.name} />
            <span>{seller.username}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
