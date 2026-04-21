import { Star, CheckCircle2, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import "./SellerPanel.css";

export default function SellerPanel({ seller }) {
  if (!seller) return null;
  const stars = Math.round(seller.rating);

  return (
    <div className="seller-panel card">
      <div className="seller-header">
        <img src={seller.avatar} alt={seller.name} className="seller-avatar" />
        <div className="seller-details">
          <div className="seller-name-row">
            <h3 className="seller-name">{seller.name}</h3>
            {seller.verified && (
              <span className="badge badge-verified">
                <CheckCircle2 size={10} /> Verified
              </span>
            )}
          </div>
          <span className="seller-username">{seller.username}</span>
          <div className="seller-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < stars ? "#d4af37" : "none"}
                stroke={i < stars ? "#d4af37" : "var(--text-muted)"}
              />
            ))}
            <span className="rating-text">{seller.rating} ({seller.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <p className="seller-bio">{seller.bio}</p>

      <div className="seller-stats">
        <div className="seller-stat">
          <span className="stat-val">{seller.sales}</span>
          <span className="stat-key">Sales</span>
        </div>
        <div className="seller-stat">
          <span className="stat-val">{(seller.followers / 1000).toFixed(1)}k</span>
          <span className="stat-key">Followers</span>
        </div>
        <div className="seller-stat">
          <span className="stat-val">{seller.joined}</span>
          <span className="stat-key">Joined</span>
        </div>
      </div>

      <div className="seller-location">
        <MapPin size={13} />
        <span>{seller.location}</span>
      </div>
    </div>
  );
}
