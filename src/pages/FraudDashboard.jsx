import { useState } from "react";
import {
  AlertTriangle, Shield, CheckCircle, XCircle, Clock,
  Activity, ExternalLink, ChevronDown, ChevronUp, Search
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Link } from "react-router-dom";
import { listings } from "../data/mockData";
import "./MetaPortal.css";

const fraudTrend = [
  { day: "Mon", flagged: 12, resolved: 9 },
  { day: "Tue", flagged: 19, resolved: 14 },
  { day: "Wed", flagged: 8,  resolved: 7 },
  { day: "Thu", flagged: 24, resolved: 18 },
  { day: "Fri", flagged: 31, resolved: 22 },
  { day: "Sat", flagged: 15, resolved: 12 },
  { day: "Sun", flagged: 9,  resolved: 8 },
];

const fraudTypes = [
  { name: "Counterfeit", value: 38, color: "#ed4956" },
  { name: "Payment Fraud", value: 27, color: "#fd1d1d" },
  { name: "Fake Accounts", value: 18, color: "#fcb045" },
  { name: "Phishing", value: 11, color: "#833ab4" },
  { name: "Other", value: 6, color: "#555" },
];

// Fraud signals mapped to actual listings
const FRAUD_FLAGS = [
  {
    id: "F1001",
    listingId: "l1",
    type: "Counterfeit Luxury",
    risk: "critical",
    fraudScore: 94,
    status: "pending",
    reportedAt: "2 min ago",
    seller: "@sofiastyle",
    sellerIp: "185.234.xx.xx",
    country: "🇷🇺 RU",
    reasons: [
      { label: "Price 29% below market average for this item", weight: 32 },
      { label: "Seller account created < 30 days ago", weight: 26 },
      { label: "Image reverse-match found on counterfeit marketplace", weight: 24 },
      { label: "No authentication certificate provided", weight: 12 },
    ],
  },
  {
    id: "F1002",
    listingId: "l4",
    type: "Payment Fraud",
    risk: "critical",
    fraudScore: 89,
    status: "pending",
    reportedAt: "8 min ago",
    seller: "@jakevintage",
    sellerIp: "45.33.xx.xx",
    country: "🇳🇬 NG",
    reasons: [
      { label: "3 chargebacks filed against seller in last 14 days", weight: 38 },
      { label: "Rapid relisting after each sale cancellation", weight: 28 },
      { label: "IP address flagged in fraud database", weight: 23 },
    ],
  },
  {
    id: "F1003",
    listingId: "l2",
    type: "Counterfeit Sneakers",
    risk: "high",
    fraudScore: 76,
    status: "reviewing",
    reportedAt: "22 min ago",
    seller: "@marcusfinds",
    sellerIp: "103.xx.xx.xx",
    country: "🇨🇳 CN",
    reasons: [
      { label: "SKU number doesn't match Nike's official database", weight: 35 },
      { label: "Image metadata matches known replica supplier batch", weight: 29 },
      { label: "Seller lists same shoe in 6 different sizes simultaneously", weight: 12 },
    ],
  },
  {
    id: "F1004",
    listingId: "l8",
    type: "Phishing Link",
    risk: "high",
    fraudScore: 71,
    status: "reviewing",
    reportedAt: "45 min ago",
    seller: "@jakevintage",
    sellerIp: "91.xx.xx.xx",
    country: "🇺🇦 UA",
    reasons: [
      { label: "Description contains obfuscated external URL", weight: 40 },
      { label: "URL domain registered 3 days ago", weight: 31 },
    ],
  },
  {
    id: "F1005",
    listingId: "l3",
    type: "Price Manipulation",
    risk: "medium",
    fraudScore: 48,
    status: "pending",
    reportedAt: "1 hr ago",
    seller: "@aishacurates",
    sellerIp: "77.xx.xx.xx",
    country: "🇬🇧 GB",
    reasons: [
      { label: "Price changed 7 times in 24 hours", weight: 45 },
      { label: "Sudden 200% price increase after initial views spike", weight: 35 },
      { label: "Multiple accounts viewing listing from same IP", weight: 20 },
    ],
  },
  {
    id: "F1006",
    listingId: "l6",
    type: "Counterfeit Sneakers",
    risk: "low",
    fraudScore: 22,
    status: "resolved",
    reportedAt: "3 hr ago",
    seller: "@marcusfinds",
    sellerIp: "24.xx.xx.xx",
    country: "🇺🇸 US",
    reasons: [
      { label: "Listing image flagged by automated vision model (low confidence)", weight: 60 },
      { label: "Seller has 98% positive rating — likely false positive", weight: 40 },
    ],
  },
];

const riskMeta = {
  critical: { color: "#ed4956", bg: "rgba(237,73,86,0.12)", label: "CRITICAL" },
  high:     { color: "#fd1d1d", bg: "rgba(253,29,29,0.1)",  label: "HIGH" },
  medium:   { color: "#fcb045", bg: "rgba(252,176,69,0.1)", label: "MEDIUM" },
  low:      { color: "#0095f6", bg: "rgba(0,149,246,0.1)",  label: "LOW" },
};

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tt-label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || p.stroke, fontSize: "0.75rem" }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

function ScoreBar({ score }) {
  const color = score >= 80 ? "#ed4956" : score >= 60 ? "#fd1d1d" : score >= 40 ? "#fcb045" : "#0095f6";
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="score-number" style={{ color }}>{score}%</span>
    </div>
  );
}

function ReasonBar({ reason }) {
  return (
    <div className="reason-item">
      <div className="reason-bar-header">
        <div className="reason-bar-track">
          <div className="reason-bar-fill" style={{ width: `${reason.weight}%` }} />
        </div>
        <span className="reason-weight">{reason.weight}%</span>
      </div>
      <span className="reason-label">{reason.label}</span>
    </div>
  );
}

export default function FraudDashboard() {
  const [flags, setFlags] = useState(FRAUD_FLAGS);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const handleAction = (id, action) => {
    setFlags(prev => prev.map(f =>
      f.id === id ? { ...f, status: action === "resolve" ? "resolved" : "dismissed" } : f
    ));
    if (expanded === id) setExpanded(null);
    showToast(action === "resolve" ? "Case resolved. Seller account actioned." : "Flag dismissed as false positive.");
  };

  const filtered = flags.filter(f => {
    const matchF = filter === "all" || f.status === filter || f.risk === filter;
    const matchS = !search ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.seller.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const pending = flags.filter(f => f.status === "pending").length;
  const reviewing = flags.filter(f => f.status === "reviewing").length;

  return (
    <div className="meta-page fade-in">
      {/* Header */}
      <div className="meta-page-header">
        <div className="meta-title-row">
          <div className="meta-title-icon fraud"><Shield size={20} /></div>
          <div>
            <h1 className="meta-page-title">Fraud Detection</h1>
            <p className="meta-page-sub">ML-powered signals · Real-time monitoring · 2,840 accounts protected today</p>
          </div>
        </div>
        <div className="live-badge"><span className="live-dot" /> LIVE</div>
      </div>

      {/* KPIs */}
      <div className="meta-kpi-row">
        {[
          { label: "Active Flags",       val: pending + reviewing, icon: <AlertTriangle size={18}/>, color: "red",    sub: "+4 this hour" },
          { label: "Pending Review",     val: pending,              icon: <Clock size={18}/>,        color: "orange", sub: `${pending} need action` },
          { label: "Resolved Today",     val: 92,                   icon: <CheckCircle size={18}/>,  color: "green",  sub: "92% resolution rate" },
          { label: "Accounts Suspended", val: 14,                   icon: <XCircle size={18}/>,      color: "red",    sub: "+3 today" },
          { label: "False Positive Rate",val: "8.2%",               icon: <Activity size={18}/>,     color: "blue",   sub: "↓ 1.4% vs yesterday" },
        ].map(k => (
          <div className="meta-kpi card" key={k.label}>
            <div className={`meta-kpi-icon color-${k.color}`}>{k.icon}</div>
            <div>
              <p className="meta-kpi-label">{k.label}</p>
              <p className="meta-kpi-val">{k.val}</p>
              <p className="meta-kpi-change">{k.sub}</p>
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
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={fraudTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ed4956" stopOpacity={0.3}/><stop offset="95%" stopColor="#ed4956" stopOpacity={0}/></linearGradient>
                <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00ba7c" stopOpacity={0.3}/><stop offset="95%" stopColor="#00ba7c" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="flagged" name="flagged" stroke="#ed4956" fill="url(#fG)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="resolved" name="resolved" stroke="#00ba7c" fill="url(#rG)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card meta-chart-card">
          <div className="chart-hdr">
            <span className="chart-title-txt">Fraud by Category</span>
            <span className="chart-sub">All-time distribution</span>
          </div>
          <div className="pie-wrap">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={fraudTypes} cx="50%" cy="50%" innerRadius={46} outerRadius={72} paddingAngle={3} dataKey="value">
                  {fraudTypes.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12 }} />
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

      {/* ── Fraud flags cards ── */}
      <div className="fraud-flags-section">
        <div className="fraud-flags-header">
          <span className="chart-title-txt">Active Flags ({filtered.length})</span>
          <div className="flags-controls">
            <div className="meta-search-wrap">
              <Search size={13} />
              <input
                className="meta-search-input"
                placeholder="Search ID, seller, type…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="meta-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="fraud-cards-grid">
          {filtered.map(flag => {
            const listing = listings.find(l => l.id === flag.listingId);
            const rm = riskMeta[flag.risk];
            const isExpanded = expanded === flag.id;
            const isDone = flag.status === "resolved" || flag.status === "dismissed";

            return (
              <div key={flag.id} className={`fraud-card card ${isDone ? "fraud-card-done" : ""}`}>
                {/* Card top: image + listing info */}
                <div className="fraud-card-top">
                  {listing && (
                    <div className="fraud-listing-img-wrap">
                      <img src={listing.images[0]} alt={listing.title} className="fraud-listing-img" />
                      <div className="fraud-img-overlay">
                        <Link to={`/product/${listing.id}`} className="fraud-listing-link" target="_blank">
                          <ExternalLink size={12} /> View Listing
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="fraud-card-meta">
                    <div className="fraud-card-top-row">
                      <span className="fraud-flag-id">{flag.id}</span>
                      <span className="risk-chip" style={{ background: rm.bg, color: rm.color, border: `1px solid ${rm.color}33` }}>
                        {rm.label}
                      </span>
                      <span className={`status-chip status-${flag.status}`}>{flag.status}</span>
                    </div>

                    <p className="fraud-type">{flag.type}</p>
                    {listing && (
                      <Link to={`/product/${listing.id}`} className="fraud-listing-title">
                        {listing.title}
                      </Link>
                    )}

                    <div className="fraud-seller-row">
                      <span className="fraud-seller">{flag.seller}</span>
                      <span className="fraud-origin">{flag.country} · {flag.sellerIp}</span>
                    </div>

                    <div className="fraud-score-section">
                      <span className="fraud-score-label">Fraud Probability</span>
                      <ScoreBar score={flag.fraudScore} />
                    </div>

                    <div className="fraud-reported">Reported {flag.reportedAt}</div>
                  </div>
                </div>

                {/* Expand reasons */}
                <button className="fraud-expand-btn" onClick={() => setExpanded(isExpanded ? null : flag.id)}>
                  {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                  {isExpanded ? "Hide" : "Show"} fraud signals ({flag.reasons.length})
                </button>

                {isExpanded && (
                  <div className="fraud-reasons">
                    <p className="fraud-reasons-title">Contributing Signals</p>
                    {flag.reasons.map((r, i) => <ReasonBar key={i} reason={r} />)}
                  </div>
                )}

                {/* Action buttons */}
                {!isDone ? (
                  <div className="fraud-card-actions">
                    <button className="fraud-action-btn dismiss" onClick={() => handleAction(flag.id, "dismiss")}>
                      <XCircle size={14}/> False Positive
                    </button>
                    <button className="fraud-action-btn resolve" onClick={() => handleAction(flag.id, "resolve")}>
                      <CheckCircle size={14}/> Take Action
                    </button>
                  </div>
                ) : (
                  <div className="fraud-actioned">
                    {flag.status === "resolved" ? <CheckCircle size={13}/> : <XCircle size={13}/>}
                    {flag.status === "resolved" ? "Actioned" : "Dismissed as false positive"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state"><p>No flags match your filter.</p></div>
        )}
      </div>

      {toast && (
        <div className="toast">
          <CheckCircle size={14} style={{ color: "var(--green)" }} /> {toast}
        </div>
      )}
    </div>
  );
}
