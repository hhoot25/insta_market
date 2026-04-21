import { useState } from "react";
import {
  AlertTriangle, Shield, Eye, TrendingUp, Users, Flag,
  CheckCircle, XCircle, Clock, Search, Filter, ChevronDown, Activity
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";


const fraudTrend = [
  { day: "Mon", flagged: 12, resolved: 9, false_pos: 3 },
  { day: "Tue", flagged: 19, resolved: 14, false_pos: 5 },
  { day: "Wed", flagged: 8,  resolved: 7,  false_pos: 1 },
  { day: "Thu", flagged: 24, resolved: 18, false_pos: 4 },
  { day: "Fri", flagged: 31, resolved: 22, false_pos: 6 },
  { day: "Sat", flagged: 15, resolved: 12, false_pos: 2 },
  { day: "Sun", flagged: 9,  resolved: 8,  false_pos: 1 },
];

const fraudTypes = [
  { name: "Counterfeit", value: 38, color: "#ed4956" },
  { name: "Payment Fraud", value: 27, color: "#fd1d1d" },
  { name: "Fake Accounts", value: 18, color: "#fcb045" },
  { name: "Phishing", value: 11, color: "#833ab4" },
  { name: "Other", value: 6, color: "#555" },
];

const INITIAL_FLAGS = [
  { id: "F1001", type: "Counterfeit", seller: "@luxefakes99", listing: "Chanel Bag (Replica)", risk: "high", amount: "$3,200", reported: "2 min ago", status: "pending", ip: "185.234.xx.xx", country: "🇷🇺 RU" },
  { id: "F1002", type: "Payment Fraud", seller: "@quicksell22", listing: "MacBook Pro M3", risk: "critical", amount: "$1,650", reported: "8 min ago", status: "pending", ip: "45.33.xx.xx", country: "🇳🇬 NG" },
  { id: "F1003", type: "Fake Account", seller: "@deals4u_bot", listing: "Multiple listings", risk: "high", amount: "$480", reported: "15 min ago", status: "reviewing", ip: "103.xx.xx.xx", country: "🇨🇳 CN" },
  { id: "F1004", type: "Phishing Link", seller: "@sneaker_drop", listing: "Jordan 4 Military", risk: "medium", amount: "$320", reported: "34 min ago", status: "reviewing", ip: "91.xx.xx.xx", country: "🇺🇦 UA" },
  { id: "F1005", type: "Counterfeit", seller: "@vintage_real", listing: "Vintage Levis", risk: "low", amount: "$98", reported: "1 hr ago", status: "resolved", ip: "24.xx.xx.xx", country: "🇺🇸 US" },
  { id: "F1006", type: "Payment Fraud", seller: "@artisan_aisha", listing: "Moonstone Ring", risk: "medium", amount: "$145", reported: "2 hr ago", status: "resolved", ip: "77.xx.xx.xx", country: "🇬🇧 GB" },
];

const riskColor = { critical: "#ed4956", high: "#fd1d1d", medium: "#fcb045", low: "#0095f6" };
const riskBg = { critical: "rgba(237,73,86,0.12)", high: "rgba(253,29,29,0.1)", medium: "rgba(252,176,69,0.1)", low: "rgba(0,149,246,0.1)" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tt-label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || p.stroke }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function FraudDashboard() {
  const [flags, setFlags] = useState(INITIAL_FLAGS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const handleAction = (id, action) => {
    setFlags(prev => prev.map(f =>
      f.id === id ? { ...f, status: action === "approve" ? "resolved" : "dismissed" } : f
    ));
    showToast(action === "approve" ? "Case resolved & account actioned." : "Flag dismissed as false positive.");
  };

  const filtered = flags.filter(f => {
    const matchFilter = filter === "all" || f.status === filter || f.risk === filter;
    const matchSearch = !search || f.seller.includes(search) || f.listing.toLowerCase().includes(search.toLowerCase()) || f.id.includes(search);
    return matchFilter && matchSearch;
  });

  const pending = flags.filter(f => f.status === "pending").length;
  const reviewing = flags.filter(f => f.status === "reviewing").length;
  const resolved = flags.filter(f => f.status === "resolved").length;

  return (
    <div className="meta-page fade-in">
      <div className="meta-page-header">
        <div className="meta-title-row">
          <div className="meta-title-icon fraud"><Shield size={20} /></div>
          <div>
            <h1 className="meta-page-title">Fraud Detection</h1>
            <p className="meta-page-sub">Real-time monitoring · Auto-ML signals · 2,840 accounts protected today</p>
          </div>
        </div>
        <div className="live-badge">
          <span className="live-dot" /> LIVE
        </div>
      </div>

      {/* KPIs */}
      <div className="meta-kpi-row">
        {[
          { label: "Active Flags", val: pending + reviewing, icon: <AlertTriangle size={18}/>, color: "red", change: "+4 this hour" },
          { label: "Pending Review", val: pending, icon: <Clock size={18}/>, color: "orange", change: `${pending} need action` },
          { label: "Resolved Today", val: resolved + 89, icon: <CheckCircle size={18}/>, color: "green", change: "92% resolution rate" },
          { label: "Accounts Suspended", val: 14, icon: <XCircle size={18}/>, color: "red", change: "+3 today" },
          { label: "False Positive Rate", val: "8.2%", icon: <Activity size={18}/>, color: "blue", change: "↓ 1.4% vs yesterday" },
        ].map(k => (
          <div className="meta-kpi card" key={k.label}>
            <div className={`meta-kpi-icon color-${k.color}`}>{k.icon}</div>
            <div>
              <p className="meta-kpi-label">{k.label}</p>
              <p className="meta-kpi-val">{k.val}</p>
              <p className="meta-kpi-change">{k.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="meta-charts-row">
        <div className="card meta-chart-card">
          <div className="chart-hdr">
            <span className="chart-title-txt">Fraud Signals — Last 7 Days</span>
            <span className="chart-sub">Flagged vs Resolved</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={fraudTrend} margin={{ top: 5, right: 5, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="flagGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ed4956" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ed4956" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ba7c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ba7c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="flagged" name="flagged" stroke="#ed4956" fill="url(#flagGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="resolved" name="resolved" stroke="#00ba7c" fill="url(#resGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card meta-chart-card">
          <div className="chart-hdr">
            <span className="chart-title-txt">Fraud by Category</span>
            <span className="chart-sub">All time distribution</span>
          </div>
          <div className="pie-wrap">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={fraudTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {fraudTypes.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ background: "#1c1c1c", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {fraudTypes.map(t => (
                <div key={t.name} className="pie-legend-item">
                  <span className="pie-dot" style={{ background: t.color }} />
                  <span>{t.name}</span>
                  <span className="pie-pct">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Flags table */}
      <div className="card flags-section">
        <div className="flags-header">
          <span className="chart-title-txt">Active Flags</span>
          <div className="flags-controls">
            <div className="meta-search-wrap">
              <Search size={13} />
              <input
                className="meta-search-input"
                placeholder="Search ID, seller, listing…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="meta-filter-select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Flags</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="critical">Critical</option>
              <option value="high">High Risk</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="flags-table">
          <div className="ftable-head">
            <span>Flag ID</span>
            <span>Type</span>
            <span>Seller</span>
            <span>Listing</span>
            <span>Risk</span>
            <span>Amount</span>
            <span>Origin</span>
            <span>Reported</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {filtered.map(f => (
            <div key={f.id} className={`ftable-row ${f.status === "resolved" || f.status === "dismissed" ? "row-dim" : ""}`}>
              <span className="flag-id">{f.id}</span>
              <span className="flag-type">{f.type}</span>
              <span className="flag-seller">{f.seller}</span>
              <span className="flag-listing">{f.listing}</span>
              <span>
                <span
                  className="risk-chip"
                  style={{ background: riskBg[f.risk], color: riskColor[f.risk], border: `1px solid ${riskColor[f.risk]}33` }}
                >
                  {f.risk}
                </span>
              </span>
              <span className="flag-amount">{f.amount}</span>
              <span className="flag-origin">{f.country} <span className="flag-ip">{f.ip}</span></span>
              <span className="flag-time">{f.reported}</span>
              <span>
                <span className={`status-chip status-${f.status}`}>{f.status}</span>
              </span>
              <span className="flag-actions">
                {(f.status === "pending" || f.status === "reviewing") ? (
                  <>
                    <button className="fa-btn approve" onClick={() => handleAction(f.id, "approve")} title="Resolve">
                      <CheckCircle size={14} />
                    </button>
                    <button className="fa-btn dismiss" onClick={() => handleAction(f.id, "dismiss")} title="Dismiss">
                      <XCircle size={14} />
                    </button>
                  </>
                ) : (
                  <span className="actioned-label">{f.status === "resolved" ? "Actioned" : "Dismissed"}</span>
                )}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: "32px" }}>
              <p>No flags match your filter.</p>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="toast">
          {toast.type === "success" ? <CheckCircle size={15} style={{ color: "var(--green)" }} /> : <AlertTriangle size={15} style={{ color: "var(--gold)" }} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
import "./MetaPortal.css";
