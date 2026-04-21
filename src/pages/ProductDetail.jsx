import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Heart, ShoppingCart, MessageCircle,
  Zap, Eye, Bookmark, Share2, CheckCircle2, ArrowLeft
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { users } from "../data/mockData";
import SellerPanel from "../components/SellerPanel";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, cart, addToCart, favorites, toggleFavorite } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [toast, setToast] = useState(null);

  const listing = listings.find((l) => l.id === id);
  if (!listing) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Listing not found.</p>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const seller = users.find((u) => u.id === listing.sellerId);
  const isFav = favorites.includes(listing.id);
  const inCart = cart.some((i) => i.id === listing.id);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = () => {
    if (!inCart) {
      addToCart(listing);
      showToast("Added to cart!");
    } else {
      navigate("/cart");
    }
  };

  const handleBuyNow = () => {
    addToCart(listing);
    navigate("/cart");
  };

  const conditionClass = {
    "New": "badge-new",
    "Like New": "badge-like-new",
    "Excellent": "badge-like-new",
    "Very Good": "badge-good",
    "Good": "badge-good",
  }[listing.condition] || "badge-new";

  return (
    <div className="page product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="product-detail-layout">
        {/* Image Section */}
        <div className="detail-images">
          <div className="main-image-wrap">
            <img
              src={listing.images[imgIdx]}
              alt={listing.title}
              className="main-image"
            />
            {listing.sold && <div className="sold-badge-large">Sold</div>}
            <button
              className={`fav-btn-large ${isFav ? "active" : ""}`}
              onClick={() => toggleFavorite(listing.id)}
            >
              <Heart size={20} fill={isFav ? "currentColor" : "none"} />
            </button>
            {listing.images.length > 1 && (
              <>
                <button
                  className="img-nav prev"
                  onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                  disabled={imgIdx === 0}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="img-nav next"
                  onClick={() => setImgIdx((i) => Math.min(listing.images.length - 1, i + 1))}
                  disabled={imgIdx === listing.images.length - 1}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            <div className="img-dots">
              {listing.images.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === imgIdx ? "active" : ""}`}
                  onClick={() => setImgIdx(i)}
                />
              ))}
            </div>
          </div>
          {/* Thumbnails */}
          <div className="thumbnails">
            {listing.images.map((img, i) => (
              <button
                key={i}
                className={`thumb ${i === imgIdx ? "active" : ""}`}
                onClick={() => setImgIdx(i)}
              >
                <img src={img} alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="detail-info">
          <div className="detail-category">
            {listing.category} • {listing.listedAt}
          </div>

          <h1 className="detail-title">{listing.title}</h1>

          <div className="detail-price-row">
            <span className="detail-price">${listing.price.toLocaleString()}</span>
            {listing.originalPrice && (
              <>
                <span className="detail-original">${listing.originalPrice.toLocaleString()}</span>
                <span className="detail-discount">
                  -{Math.round((1 - listing.price / listing.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <div className="detail-meta">
            <span className={`badge ${conditionClass}`}>{listing.condition}</span>
            <div className="meta-stats">
              <span><Eye size={13} /> {listing.views.toLocaleString()} views</span>
              <span><Bookmark size={13} /> {listing.saves} saves</span>
            </div>
          </div>

          <p className="detail-description">{listing.description}</p>

          {listing.tags.length > 0 && (
            <div className="detail-tags">
              {listing.tags.map((tag) => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {!listing.sold && (
            <div className="detail-actions">
              <button className="btn btn-primary action-btn" onClick={handleBuyNow}>
                <Zap size={16} /> Buy Now
              </button>
              <button
                className={`btn ${inCart ? "btn-secondary" : "btn-secondary"} action-btn`}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={16} />
                {inCart ? "View Cart" : "Add to Cart"}
              </button>
              <Link to="/messages" className="btn btn-ghost action-btn">
                <MessageCircle size={16} /> Message
              </Link>
            </div>
          )}

          {listing.sold && (
            <div className="sold-notice">
              <CheckCircle2 size={16} />
              This item has been sold.
            </div>
          )}

          {/* Seller Panel */}
          <SellerPanel seller={seller} />
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          <CheckCircle2 size={16} style={{ color: "var(--green)" }} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}
