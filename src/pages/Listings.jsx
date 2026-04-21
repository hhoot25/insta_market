import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit2, Trash2, CheckSquare, Eye, Bookmark, Plus, Package } from "lucide-react";
import { useApp } from "../context/AppContext";
import "./Listings.css";

export default function Listings() {
  const { listings, user, updateListing, deleteListing } = useApp();
  const [toast, setToast] = useState(null);

  const myListings = listings.filter((l) => l.sellerId === user.id);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleMarkSold = (id) => {
    updateListing(id, { sold: true });
    showToast("Marked as sold!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this listing?")) {
      deleteListing(id);
      showToast("Listing deleted.");
    }
  };

  const conditionClass = {
    "New": "badge-new",
    "Like New": "badge-like-new",
    "Excellent": "badge-like-new",
    "Very Good": "badge-good",
    "Good": "badge-good",
  };

  return (
    <div className="page">
      <div className="listings-header">
        <div>
          <h1 className="page-title">My Listings</h1>
          <p className="page-subtitle">{myListings.length} total listings</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <Plus size={16} /> New Listing
        </Link>
      </div>

      {myListings.length === 0 ? (
        <div className="empty-state">
          <Package size={40} style={{ color: "var(--text-muted)" }} />
          <p>No listings yet. Start selling!</p>
          <Link to="/create" className="btn btn-primary">Create Listing</Link>
        </div>
      ) : (
        <div className="listings-table">
          <div className="table-header">
            <span>Item</span>
            <span>Price</span>
            <span>Condition</span>
            <span>Stats</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {myListings.map((listing) => (
            <div key={listing.id} className={`table-row card ${listing.sold ? "row-sold" : ""}`}>
              <div className="row-item">
                <Link to={`/product/${listing.id}`}>
                  <img src={listing.images[0]} alt={listing.title} className="row-img" />
                </Link>
                <div className="row-info">
                  <Link to={`/product/${listing.id}`} className="row-title">
                    {listing.title}
                  </Link>
                  <span className="row-date">Listed {listing.listedAt}</span>
                </div>
              </div>
              <div className="row-price">${listing.price.toLocaleString()}</div>
              <div>
                <span className={`badge ${conditionClass[listing.condition] || "badge-new"}`}>
                  {listing.condition}
                </span>
              </div>
              <div className="row-stats">
                <span><Eye size={12} /> {listing.views}</span>
                <span><Bookmark size={12} /> {listing.saves}</span>
              </div>
              <div>
                {listing.sold ? (
                  <span className="badge badge-sold">Sold</span>
                ) : (
                  <span className="badge badge-new">Active</span>
                )}
              </div>
              <div className="row-actions">
                <Link to={`/create?edit=${listing.id}`} className="action-icon" title="Edit">
                  <Edit2 size={15} />
                </Link>
                {!listing.sold && (
                  <button
                    className="action-icon sold-icon"
                    onClick={() => handleMarkSold(listing.id)}
                    title="Mark as sold"
                  >
                    <CheckSquare size={15} />
                  </button>
                )}
                <button
                  className="action-icon delete-icon"
                  onClick={() => handleDelete(listing.id)}
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="toast">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
