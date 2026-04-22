import { useState } from "react";
import {
  AlertTriangle, Shield, CheckCircle, XCircle, Clock,
  Activity, ExternalLink, ChevronDown, Search, Ban, ShieldCheck
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Link } from "react-router-dom";
import { listings } from "../data/mockData";
import "./MetaPortal.css";
import "./FraudDashboard.css";

const fraudTrend = [
  { day: "Mon", flagged: 12, resolved: 9 },
  { day: "Tue", flagged: 19, resolved: 14 },
  { day: "Wed", flagged: 8,  resolved: 7  },
  { day: "Thu", flagged: 24, resolved: 18 },
  { day: "Fri", flagged: 31, resolved: 22 },
  { day: "Sat", flagged: 15, resolved: 12 },
  { day: "Sun", flagged: 9,  resolved: 8  },
];

const fraudTypes = [
  { name: "Counterfeit",   value: 38, color: "#ed4956" },
  { name: "Payment Fraud", value: 27, color: "#fd1d1d" },
  { name: "Fake Accounts", value: 18, color: "#fcb045" },
  { name: "Phishing",      value: 11, color: "#833ab4" },
  { name: "Other",         value: 6,  color: "#555"    },
];

const FRAUD_FLAGS = [
  {
    id: "F1001", listingId: "l1",
    type: "Counterfeit Luxury Goods",
    risk: "critical", fraudScore: 85, status: "pending", reportedAt: "2 min ago",
    seller: "@sofiastyle", sellerIp: "185.234.xx.xx", country: "🇷🇺 RU",
    reasons: [
      "Price listed well below market price compared to similar items",
      "Seller claims they are out of state and cannot meet in person",
      "Offers to ship the item after receiving a deposit",
      "Requests unsafe payment methods (gift cards, wire transfer, etc.)",
    ],
  },
  {
    id: "F1002", listingId: "l4",
    type: "Payment Fraud",
    risk: "critical", fraudScore: 50, status: "pending", reportedAt: "8 min ago",
    seller: "@jakevintage", sellerIp: "45.33.xx.xx", country: "🇳🇬 NG",
    reasons: [
      "Price is slightly below market value, but not unrealistically cheap",
      "Seller is local and willing to meet, but prefers quick same-day pickup",
      "Accepts normal payments (cash, apps), but pushes for upfront deposit to 'hold' it",
    ],
  },
  {
    id: "F1003", listingId: "l2",
    type: "Counterfeit Sneakers",
    risk: "high", fraudScore: 76, status: "reviewing", reportedAt: "22 min ago",
    seller: "@marcusfinds", sellerIp: "103.xx.xx.xx", country: "🇨🇳 CN",
    reasons: [
      "SKU number doesn't match Nike's official product database",
      "Image metadata matches known replica supplier photo batch",
      "Seller listing same shoe across 6 sizes simultaneously — unusual for private seller",
    ],
  },
  {
    id: "F1004", listingId: "l8",
    type: "Phishing Link in Listing",
    risk: "high", fraudScore: 71, status: "reviewing", reportedAt: "45 min ago",
    seller: "@jakevintage", sellerIp: "91.xx.xx.xx", country: "🇺🇦 UA",
    reasons: [
      "Description contains obfuscated external URL routing traffic off-platform",
      "Linked domain was registered only 3 days ago with privacy-shielded registrar",
    ],
  },
  {
    id: "F1005", listingId: "l3",
    type: "Price Manipulation",
    risk: "medium", fraudScore: 48, status: "pending", reportedAt: "1 hr ago",
    seller: "@aishacurates", sellerIp: "77.xx.xx.xx", country: "🇬🇧 GB",
    reasons: [
      "Price changed 7 times within a 24-hour window",
      "Sudden 200% price spike immediately following an organic views surge",
      "Multiple distinct accounts viewing the listing from a single IP address",
    ],
  },
  {
    id: "F1006", listingId: "l6",
    type: "Suspected Counterfeit",
    risk: "low", fraudScore: 10, status: "resolved", reportedAt: "3 hr ago",
    seller: "@marcusfinds", sellerIp: "24.xx.xx.xx", country: "🇺🇸 US",
    reasons: [
      "Price is fair or only slightly below market value",
      "Seller is local and open to meeting in person",
      "Seller account appears normal but not heavily active",
      "Mentions what's included (Joy-Cons, dock, charger, games if any)",
    ],
  },
];

const riskMeta = {
  critical: { color: "#ed4956", bg: "rgba(237,73,86,0.12)", label: "CRITICAL" },
  high:     { color: "#fd1d1d", bg: "rgba(253,29,29,0.10)", label: "HIGH"     },
  medium:   { color: "#fcb045", bg: "rgba(252,176,69,0.10)",label: "MEDIUM"   },
  low:      { color: "#0095f6", bg: "rgba(0,149,246,0.10)", label: "LOW"      },
};

function scoreColor(s) {
  if (s >= 75) return "#ed4956";
  if (s >= 40) return "#fcb045";
  return "#00ba7c";
}
function scoreLabel(s) {
  if (s >= 75) return "High Risk";
  if (s >= 40) return "Medium Risk";
  return "Low Risk";
}

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tt-label">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || p.stroke, fontSize: "0.75rem" }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function FraudDashboard() {
  const [flags, setFlags]           = useState(FRAUD_FLAGS);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [actionModal, setActionModal] = useState(null);
  const [toast, setToast]           = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleAction = (id, action) => {
    setFlags(prev => prev.map(f =>
      f.id === id ? { ...f, status: action === "resolve" ? "resolved" : "dismissed" } : f
    ));
    setActionModal(null);
    showToast(action === "resolve"
      ? "Seller suspended. Listing removed from platform."
      : "Flag dismissed — marked as false positive.");
  };

  const pending   = flags.filter(f => f.status === "pending").length;
  const reviewing = flags.filter(f => f.status === "reviewing").length;

  const filtered = flags.filter(f => {
    const mF = filter === "all" || f.status === filter || f.risk === filter;
    const mS = !search ||
      f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.seller.toLowerCase().includes(search.toLowerCase()) ||
      f.type.toLowerCase().includes(search.toLowerCase());
    return mF && mS;
  });

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
          { label: "Active Flags",        val: pending + reviewing, icon: <AlertTriangle size={18}/>, color: "red",    sub: "+4 this hour"       },
          { label: "Pending Review",      val: pending,             icon: <Clock size={18}/>,         color: "orange", sub: `${pending} need action` },
          { label: "Resolved Today",      val: 92,                  icon: <CheckCircle size={18}/>,   color: "green",  sub: "92% resolution rate" },
          { label: "Accounts Suspended",  val: 14,                  icon: <XCircle size={18}/>,       color: "red",    sub: "+3 today"            },
          { label: "False Positive Rate", val: "8.2%",              icon: <Activity size={18}/>,      color: "blue",   sub: "↓ 1.4% vs yesterday" },
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
                <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ed4956" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ed4956" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00ba7c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ba7c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="day" tick={{ fill: "#555", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="flagged"  name="flagged"  stroke="#ed4956" fill="url(#fG)" strokeWidth={2} dot={false} />
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
                <Tooltip
                  formatter={(v, n) => [`${v}%`, n]}
                  contentStyle={{ background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 8, fontSize: 12 }}
                />
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

      {/* ── Fraud flag rows ── */}
      <div className="fd-section card">
        <div className="fd-section-header">
          <span className="chart-title-txt">
            Active Flags <span className="fd-count-badge">{filtered.length}</span>
          </span>
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
              <option value="all">All Flags</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="critical">Critical</option>
              <option value="high">High Risk</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="fd-list">
          {filtered.map(flag => {
            const listing = listings.find(l => l.id === flag.listingId);
            const rm      = riskMeta[flag.risk];
            const sc      = scoreColor(flag.fraudScore);
            const isDone  = flag.status === "resolved" || flag.status === "dismissed";

            return (
              <div key={flag.id} className={`fd-row ${isDone ? "fd-row-done" : ""}`}>

                {/* Col 1 — Image + link */}
                <div className="fd-col-img">
                  {listing && (
                    <>
                      <div className="fd-thumb-wrap">
                        <img src={listing.images[0]} alt={listing.title} className="fd-thumb" />
                      </div>
                      <Link to={`/product/${listing.id}`} className="fd-listing-link">
                        <ExternalLink size={10} /> Link to Listing
                      </Link>
                    </>
                  )}
                </div>

                {/* Col 2 — Reasons */}
                <div className="fd-col-reasons">
                  <div className="fd-row-tags">
                    <span className="fd-flag-id">{flag.id}</span>
                    <span className="risk-chip" style={{ background: rm.bg, color: rm.color, border: `1px solid ${rm.color}44` }}>
                      {rm.label}
                    </span>
                    <span className={`status-chip status-${flag.status}`}>{flag.status}</span>
                  </div>

                  <p className="fd-reason-heading">Reason for fraud score</p>
                  <ul className="fd-reason-bullets">
                    {flag.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>

                  <div className="fd-seller-meta">
                    <span>{flag.seller}</span>
                    <span className="fd-dot">·</span>
                    <span>{flag.country} {flag.sellerIp}</span>
                    <span className="fd-dot">·</span>
                    <span>{flag.reportedAt}</span>
                  </div>
                </div>

                {/* Col 3 — Score */}
                <div className="fd-col-score">
                  <p className="fd-score-lbl">Fraud detection</p>
                  <p className="fd-score-lbl">Score:</p>
                  <div className="fd-score-ring" style={{ "--sc": sc }}>
                    <svg viewBox="0 0 80 80" className="fd-score-svg">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="var(--bg-elevated)" strokeWidth="7"/>
                      <circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke={sc} strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - flag.fraudScore / 100)}`}
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                    <span className="fd-score-num" style={{ color: sc }}>{flag.fraudScore}%</span>
                  </div>
                  <span className="fd-score-risk-label" style={{ color: sc }}>{scoreLabel(flag.fraudScore)}</span>
                </div>

                {/* Col 4 — Action */}
                <div className="fd-col-action">
                  {!isDone ? (
                    <button className="fd-action-btn" onClick={() => setActionModal(flag)}>
                      Action <ChevronDown size={13} />
                    </button>
                  ) : (
                    <div className="fd-done-chip">
                      {flag.status === "resolved"
                        ? <><CheckCircle size={12} style={{ color: "var(--green)" }} /> Actioned</>
                        : <><XCircle size={12} style={{ color: "var(--text-muted)" }} /> Dismissed</>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: "52px 24px" }}>
              <p>No flags match your current filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action modal */}
      {actionModal && (
        <div className="modal-backdrop" onClick={() => setActionModal(null)}>
          <div className="fd-action-modal" onClick={e => e.stopPropagation()}>
            <div className="fd-action-modal-hdr">
              <p className="fd-action-modal-title">Take Action</p>
              <p className="fd-action-modal-sub">{actionModal.type} · {actionModal.seller}</p>
            </div>
            <div className="fd-action-choices">
              <button className="fd-choice fd-choice-danger" onClick={() => handleAction(actionModal.id, "resolve")}>
                <Ban size={17} />
                <div>
                  <strong>Suspend Seller &amp; Remove Listing</strong>
                  <small>Account suspended, listing removed, buyer notified</small>
                </div>
              </button>
              <button className="fd-choice fd-choice-warn" onClick={() => handleAction(actionModal.id, "resolve")}>
                <AlertTriangle size={17} />
                <div>
                  <strong>Issue Warning to Seller</strong>
                  <small>Formal warning email sent, account flagged for monitoring</small>
                </div>
              </button>
              <button className="fd-choice fd-choice-safe" onClick={() => handleAction(actionModal.id, "dismiss")}>
                <ShieldCheck size={17} />
                <div>
                  <strong>Dismiss — False Positive</strong>
                  <small>Mark as reviewed, no further action required</small>
                </div>
              </button>
            </div>
            <button className="fd-modal-cancel" onClick={() => setActionModal(null)}>Cancel</button>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <CheckCircle size={14} style={{ color: "var(--green)" }} /> {toast}
        </div>
      )}
    </div>
  );
}
