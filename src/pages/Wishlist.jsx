import { useState } from "react";
import { Heart, Trash2, ShoppingCart, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { users } from "../data/mockData";
import "./Wishlist.css";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart, cart, listings } = useApp();
  const [toast, setToast] = useState(null);

  const wishlisted = listings.filter(l => wishlist.includes(l.id));

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const handleAddToCart = (listing) => {
    addToCart(listing);
    showToast(`"${listing.title}" added to cart`);
  };

  const handleRemove = (id) => {
    removeFromWishlist(id);
  };

  const totalValue = wishlisted.reduce((sum, l) => sum + l.price, 0);

  if (wishlisted.length === 0) {
    return (
      <div className="page wishlist-page">
        <div className="wishlist-header">
          <h1 className="page-title">Wishlist</h1>
          <p className="page-subtitle">Items you've saved for later</p>
        </div>
        <div className="wishlist-empty">
          <div className="empty-heart-icon">
            <Heart size={48} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Heart any listing to save it here for later.</p>
          <Link to="/" className="btn btn-primary">
            Browse Listings <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page wishlist-page">
      <div className="wishlist-header">
        <div>
          <h1 className="page-title">Wishlist</h1>
          <p className="page-subtitle">{wishlisted.length} saved item{wishlisted.length !== 1 ? "s" : ""}</p>
        </div>
        {wishlisted.length > 0 && (
          <div className="wishlist-total-card">
            <Tag size={14} />
            <span>Total value</span>
            <strong>${totalValue.toLocaleString()}</strong>
          </div>
        )}
      </div>

      <div className="wishlist-grid">
        {wishlisted.map(listing => {
          const seller = users.find(u => u.id === listing.sellerId);
          const inCart = cart.some(i => i.id === listing.id);
          const condClass = {
            "New": "badge-new", "Like New": "badge-like-new", "Excellent": "badge-like-new",
            "Very Good": "badge-good", "Good": "badge-good",
          }[listing.condition] || "badge-new";

          return (
            <div key={listing.id} className={`wl-card card ${listing.sold ? "wl-sold" : ""}`}>
              <div className="wl-img-wrap">
                <Link to={`/product/${listing.id}`}>
                  <img src={listing.images[0]} alt={listing.title} className="wl-img" />
                </Link>
                {listing.sold && <div className="wl-sold-overlay">Sold</div>}
                <span className={`wl-condition badge ${condClass}`}>{listing.condition}</span>
                <button
                  className="wl-remove-btn"
                  onClick={() => handleRemove(listing.id)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="wl-body">
                <Link to={`/product/${listing.id}`} className="wl-title">{listing.title}</Link>
                <div className="wl-price-row">
                  <span className="wl-price">${listing.price.toLocaleString()}</span>
                  {listing.originalPrice && (
                    <span className="wl-original">${listing.originalPrice.toLocaleString()}</span>
                  )}
                  {listing.originalPrice && (
                    <span className="wl-savings">
                      Save ${(listing.originalPrice - listing.price).toLocaleString()}
                    </span>
                  )}
                </div>

                {seller && (
                  <div className="wl-seller">
                    <img src={seller.avatar} alt={seller.name} className="wl-seller-avatar" />
                    <span>{seller.username}</span>
                  </div>
                )}
              </div>

              <div className="wl-actions">
                {!listing.sold ? (
                  <button
                    className={`wl-cart-btn ${inCart ? "in-cart" : ""}`}
                    onClick={() => !inCart && handleAddToCart(listing)}
                  >
                    <ShoppingCart size={14} />
                    {inCart ? "In Cart" : "Add to Cart"}
                  </button>
                ) : (
                  <span className="wl-sold-label">No longer available</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div className="toast">
          <ShoppingCart size={14} style={{ color: "var(--green)" }} /> {toast}
        </div>
      )}
    </div>
  );
}
