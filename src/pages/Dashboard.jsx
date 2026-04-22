import { useState } from "react";
import {
  Eye, Bookmark, DollarSign, ShoppingBag, Plus, Edit2,
  Trash2, CheckSquare, TrendingUp, Package, X, Save, ImagePlus
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import KPIBox from "../components/KPIBox";
import { analyticsData, categories } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const CONDITIONS = ["New", "Like New", "Excellent", "Very Good", "Good"];

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="ct-label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || p.stroke, fontSize: "0.75rem" }}>
          {p.name}: {p.name === "revenue" ? "$" : ""}{p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const condBadge = { "New": "badge-new", "Like New": "badge-like-new", "Excellent": "badge-like-new", "Very Good": "badge-good", "Good": "badge-good" };

// ── Edit Modal ──────────────────────────────────────────────────────────────
function EditModal({ listing, onSave, onClose }) {
  const [form, setForm] = useState({
    title: listing.title,
    price: listing.price,
    condition: listing.condition,
    description: listing.description,
    category: listing.category,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="edit-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Listing</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-img-preview">
          <img src={listing.images[0]} alt={listing.title} />
        </div>

        <div className="modal-fields">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={form.title} onChange={e => set("title", e.target.value)} />
          </div>
          <div className="modal-row">
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input className="form-input" type="number" value={form.price} onChange={e => set("price", Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e => set("category", e.target.value)}>
                {categories.filter(c => c.id !== "all").map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Condition</label>
            <div className="condition-pills">
              {CONDITIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`cond-pill ${form.condition === c ? "active" : ""}`}
                  onClick={() => set("condition", c)}
                >{c}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={3} value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(listing.id, form)}>
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { listings, user, updateListing, deleteListing, addListing } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("analytics");
  const [toast, setToast] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [editTarget, setEditTarget] = useState(null);
  const { totals, weekly } = analyticsData;

  const myListings = listings.filter(l => l.sellerId === user.id);
  const filteredListings = catFilter === "all" ? myListings : myListings.filter(l => l.category === catFilter);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const handleMarkSold = id => { updateListing(id, { sold: true }); showToast("Marked as sold!"); };
  const handleDelete = id => { if (window.confirm("Delete this listing?")) { deleteListing(id); showToast("Listing deleted."); } };
  const handleSaveEdit = (id, form) => { updateListing(id, form); setEditTarget(null); showToast("Listing updated!"); };

  return (
    <div className="page">
      <div className="dash-header">
        <div>
          <h1 className="page-title">Seller Hub</h1>
          <p className="page-subtitle">Analytics, listings & store management</p>
        </div>
        <Link to="/create" className="btn btn-primary"><Plus size={15} /> New Listing</Link>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        {[
          { id: "analytics", icon: <TrendingUp size={14}/>, label: "Analytics" },
          { id: "listings",  icon: <Package size={14}/>,    label: "My Listings" },
        ].map(t => (
          <button key={t.id} className={`dash-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── ANALYTICS ── */}
      {activeTab === "analytics" && (
        <div className="fade-in">
          <div className="kpi-grid">
            <KPIBox icon={<Eye size={18}/>}         label="Total Views" value={totals.views.toLocaleString()}           change={12.4} color="blue" />
            <KPIBox icon={<Bookmark size={18}/>}    label="Saves"       value={totals.saves.toLocaleString()}            change={8.1}  color="gold" />
            <KPIBox icon={<DollarSign size={18}/>}  label="Revenue"     value={`$${totals.revenue.toLocaleString()}`}    change={22.7} color="green" />
            <KPIBox icon={<ShoppingBag size={18}/>} label="Orders"      value={totals.orders}                            change={5.3}  color="accent" />
          </div>

          <div className="charts-row">
            <div className="chart-card card">
              <div className="chart-hdr"><span className="chart-title-t">Views & Saves</span><span className="chart-period">Last 7 days</span></div>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={weekly} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0095f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#0095f6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="sG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#833ab4" stopOpacity={0.3}/><stop offset="95%" stopColor="#833ab4" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                  <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="views" name="views" stroke="#0095f6" fill="url(#vG)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="saves" name="saves" stroke="#833ab4" fill="url(#sG)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card card">
              <div className="chart-hdr"><span className="chart-title-t">Revenue</span><span className="chart-period">Last 7 days</span></div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={weekly} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="revenue" name="revenue" fill="#0095f6" radius={[4,4,0,0]} opacity={0.9} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="quick-stats-row">
            {[
              { label: "Active Listings", val: myListings.filter(l => !l.sold).length, color: "var(--green)" },
              { label: "Sold Items",      val: myListings.filter(l => l.sold).length,  color: "var(--red)" },
              { label: "Avg. Price",      val: `$${myListings.length ? Math.round(myListings.reduce((s,l) => s + l.price, 0) / myListings.length).toLocaleString() : 0}`, color: "var(--blue)" },
              { label: "Total Saves",     val: myListings.reduce((s,l) => s + l.saves, 0).toLocaleString(), color: "#a96cd9" },
            ].map(s => (
              <div key={s.label} className="quick-stat card">
                <p className="qs-val" style={{ color: s.color }}>{s.val}</p>
                <p className="qs-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LISTINGS GRID ── */}
      {activeTab === "listings" && (
        <div className="fade-in">
          <div className="listings-toolbar">
            <div className="cat-pills-scroll">
              <button className={`cat-pill-sm ${catFilter === "all" ? "active" : ""}`} onClick={() => setCatFilter("all")}>
                All <span className="pill-count">{myListings.length}</span>
              </button>
              {categories.filter(c => c.id !== "all" && myListings.some(l => l.category === c.id)).map(c => (
                <button key={c.id} className={`cat-pill-sm ${catFilter === c.id ? "active" : ""}`} onClick={() => setCatFilter(c.id)}>
                  {c.emoji} {c.label} <span className="pill-count">{myListings.filter(l => l.category === c.id).length}</span>
                </button>
              ))}
            </div>
            <Link to="/create" className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "8px 16px", flexShrink: 0 }}>
              <Plus size={14}/> Add Listing
            </Link>
          </div>

          <div className="seller-listings-grid">
            {filteredListings.map(listing => (
              <div key={listing.id} className={`slg-card card ${listing.sold ? "slg-sold" : ""}`}>
                {/* Image */}
                <div className="slg-img-wrap">
                  <Link to={`/product/${listing.id}`}>
                    <img src={listing.images[0]} alt={listing.title} className="slg-img" />
                  </Link>
                  {listing.sold && <div className="slg-sold-overlay">Sold</div>}
                  <span className={`slg-badge badge ${condBadge[listing.condition] || "badge-new"}`}>{listing.condition}</span>
                </div>

                {/* Info */}
                <div className="slg-body">
                  <Link to={`/product/${listing.id}`} className="slg-title">{listing.title}</Link>
                  <p className="slg-price">${listing.price.toLocaleString()}</p>
                  <div className="slg-stats">
                    <span><Eye size={11}/> {listing.views.toLocaleString()}</span>
                    <span><Bookmark size={11}/> {listing.saves}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="slg-actions">
                  <button className="slg-action-btn edit-btn" onClick={() => setEditTarget(listing)}>
                    <Edit2 size={13}/> Edit
                  </button>
                  {!listing.sold && (
                    <button className="slg-action-btn sold-btn" onClick={() => handleMarkSold(listing.id)}>
                      <CheckSquare size={13}/> Sold
                    </button>
                  )}
                  <button className="slg-action-btn del-btn" onClick={() => handleDelete(listing.id)}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            ))}

            {/* Add card */}
            <Link to="/create" className="slg-add-card">
              <div className="slg-add-inner">
                <div className="slg-add-icon"><Plus size={24}/></div>
                <span>Add New Listing</span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          listing={editTarget}
          onSave={handleSaveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}
