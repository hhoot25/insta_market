import { useState } from "react";
import { Eye, Bookmark, DollarSign, ShoppingBag, Plus, Edit2, Trash2, CheckSquare, TrendingUp, Package } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import KPIBox from "../components/KPIBox";
import { analyticsData, categories } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || p.stroke, fontSize: "0.78rem" }}>
          {p.name}: {p.name === "revenue" ? "$" : ""}{p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const conditionClass = {
  "New": "badge-new", "Like New": "badge-like-new", "Excellent": "badge-like-new",
  "Very Good": "badge-good", "Good": "badge-good",
};

export default function Dashboard() {
  const { listings, user, updateListing, deleteListing } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("analytics");
  const [toast, setToast] = useState(null);
  const [catFilter, setCatFilter] = useState("all");

  const myListings = listings.filter(l => l.sellerId === user.id);
  const filteredListings = catFilter === "all" ? myListings : myListings.filter(l => l.category === catFilter);
  const { totals, weekly } = analyticsData;

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const handleMarkSold = id => { updateListing(id, { sold: true }); showToast("Marked as sold!"); };
  const handleDelete = id => { if (window.confirm("Delete this listing?")) { deleteListing(id); showToast("Deleted."); } };

  return (
    <div className="page">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="page-title">Seller Hub</h1>
          <p className="page-subtitle">Manage your store, analytics & listings</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <Plus size={15} /> New Listing
        </Link>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {["analytics", "listings", "add"].map(tab => (
          <button
            key={tab}
            className={`dash-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => tab === "add" ? navigate("/create") : setActiveTab(tab)}
          >
            {tab === "analytics" && <TrendingUp size={14} />}
            {tab === "listings" && <Package size={14} />}
            {tab === "add" && <Plus size={14} />}
            {tab === "analytics" ? "Analytics" : tab === "listings" ? "My Listings" : "Add Listing"}
          </button>
        ))}
      </div>

      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="fade-in">
          {/* KPIs */}
          <div className="kpi-grid">
            <KPIBox icon={<Eye size={18}/>} label="Total Views" value={totals.views.toLocaleString()} change={12.4} color="blue" />
            <KPIBox icon={<Bookmark size={18}/>} label="Saves" value={totals.saves.toLocaleString()} change={8.1} color="gold" />
            <KPIBox icon={<DollarSign size={18}/>} label="Revenue" value={`$${totals.revenue.toLocaleString()}`} change={22.7} color="green" />
            <KPIBox icon={<ShoppingBag size={18}/>} label="Orders" value={totals.orders} change={5.3} color="accent" />
          </div>

          {/* Charts */}
          <div className="charts-row">
            <div className="chart-card card">
              <div className="chart-hdr">
                <span className="chart-title-t">Views & Saves</span>
                <span className="chart-period">Last 7 days</span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={weekly} margin={{ top: 5, right: 5, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0095f6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#0095f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#833ab4" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#833ab4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                  <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" name="views" stroke="#0095f6" fill="url(#vGrad)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="saves" name="saves" stroke="#833ab4" fill="url(#sGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card card">
              <div className="chart-hdr">
                <span className="chart-title-t">Revenue</span>
                <span className="chart-period">Last 7 days</span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={weekly} margin={{ top: 5, right: 5, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="revenue" fill="url(#igBarGrad)" radius={[4, 4, 0, 0]}>
                    <defs>
                      <linearGradient id="igBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#833ab4"/>
                        <stop offset="100%" stopColor="#fd1d1d"/>
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top listings */}
          <div className="dash-section-hdr">
            <span className="section-title">Top Listings</span>
            <button className="btn btn-ghost" style={{ fontSize: "0.78rem" }} onClick={() => setActiveTab("listings")}>
              See all →
            </button>
          </div>
          <div className="top-listings-grid">
            {myListings.slice(0, 4).map(l => (
              <Link to={`/product/${l.id}`} key={l.id} className="top-listing-card card">
                <div className="tl-img-wrap">
                  <img src={l.images[0]} alt={l.title} className="tl-img" />
                  {l.sold && <div className="tl-sold-overlay">Sold</div>}
                </div>
                <div className="tl-body">
                  <p className="tl-title">{l.title}</p>
                  <p className="tl-price">${l.price.toLocaleString()}</p>
                  <div className="tl-stats">
                    <span><Eye size={11}/> {l.views}</span>
                    <span><Bookmark size={11}/> {l.saves}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* LISTINGS TAB */}
      {activeTab === "listings" && (
        <div className="fade-in">
          {/* Category filter */}
          <div className="listings-filter-row">
            <div className="cat-pills-scroll">
              <button className={`cat-pill-sm ${catFilter === "all" ? "active" : ""}`} onClick={() => setCatFilter("all")}>All ({myListings.length})</button>
              {categories.filter(c => c.id !== "all").filter(c => myListings.some(l => l.category === c.id)).map(c => (
                <button key={c.id} className={`cat-pill-sm ${catFilter === c.id ? "active" : ""}`} onClick={() => setCatFilter(c.id)}>
                  {c.emoji} {c.label} ({myListings.filter(l => l.category === c.id).length})
                </button>
              ))}
            </div>
            <Link to="/create" className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "8px 14px", flexShrink: 0 }}>
              <Plus size={13}/> Add
            </Link>
          </div>

          {filteredListings.length === 0 ? (
            <div className="empty-state">
              <Package size={36} style={{ color: "var(--text-muted)" }} />
              <p>No listings yet.</p>
              <Link to="/create" className="btn btn-primary">Create First Listing</Link>
            </div>
          ) : (
            <div className="listings-grid">
              {filteredListings.map(listing => (
                <div key={listing.id} className={`listing-grid-card card ${listing.sold ? "listing-sold" : ""}`}>
                  <div className="lgc-img-wrap">
                    <Link to={`/product/${listing.id}`}>
                      <img src={listing.images[0]} alt={listing.title} className="lgc-img" />
                    </Link>
                    {listing.sold && <div className="lgc-sold-badge">Sold</div>}
                    <span className={`lgc-condition badge ${conditionClass[listing.condition] || "badge-new"}`}>{listing.condition}</span>
                  </div>
                  <div className="lgc-body">
                    <Link to={`/product/${listing.id}`} className="lgc-title">{listing.title}</Link>
                    <p className="lgc-price">${listing.price.toLocaleString()}</p>
                    <div className="lgc-stats">
                      <span><Eye size={11}/> {listing.views}</span>
                      <span><Bookmark size={11}/> {listing.saves}</span>
                    </div>
                    <div className="lgc-actions">
                      <Link to={`/create?edit=${listing.id}`} className="lgc-btn" title="Edit"><Edit2 size={13}/></Link>
                      {!listing.sold && (
                        <button className="lgc-btn sold-btn" onClick={() => handleMarkSold(listing.id)} title="Mark sold"><CheckSquare size={13}/></button>
                      )}
                      <button className="lgc-btn del-btn" onClick={() => handleDelete(listing.id)} title="Delete"><Trash2 size={13}/></button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add new card */}
              <Link to="/create" className="listing-add-card card">
                <Plus size={28} />
                <span>Add Listing</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}
