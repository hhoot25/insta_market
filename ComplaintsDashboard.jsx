import { useState } from "react";
import {
  MessageSquare, CheckCircle, XCircle, Clock, Search,
  ChevronDown, User, Star, Flag, AlertCircle, RefreshCw
} from "lucide-react";


const INITIAL_COMPLAINTS = [
  {
    id: "C-8821",
    category: "Item Not Received",
    priority: "high",
    status: "open",
    user: "marcus_buyer",
    userEmail: "m.rivera@gmail.com",
    seller: "@sofiastyle",
    listingTitle: "Chanel Classic Flap Bag",
    amount: "$3,200",
    submittedAt: "Today, 9:14 AM",
    description: "I paid $3,200 for a Chanel bag on Jan 15. It's been 12 days and I haven't received any tracking info. Seller stopped responding to messages after payment.",
    evidence: ["screenshot1.png", "payment_receipt.pdf"],
    assignedTo: "Unassigned",
    replies: [],
  },
  {
    id: "C-8820",
    category: "Item Not as Described",
    priority: "medium",
    status: "open",
    user: "tech_jake",
    userEmail: "j.thornton@outlook.com",
    seller: "@marcusfinds",
    listingTitle: "Nike Air Jordan 1 Retro",
    amount: "$285",
    submittedAt: "Today, 8:47 AM",
    description: "Listed as 'New/Deadstock' but the box has clear damage and the soles show yellowing. This is definitely not new. I want a full refund.",
    evidence: ["box_damage.jpg"],
    assignedTo: "Agent #4",
    replies: [
      { from: "Agent #4", text: "We've reached out to the seller for their response.", time: "9:02 AM" }
    ],
  },
  {
    id: "C-8819",
    category: "Counterfeit Item",
    priority: "critical",
    status: "reviewing",
    user: "fashion_buyer99",
    userEmail: "fashionbuyer@yahoo.com",
    seller: "@luxefakes99",
    listingTitle: "Gucci Monogram Tote",
    amount: "$890",
    submittedAt: "Yesterday, 4:30 PM",
    description: "I'm a luxury goods authenticator. The Gucci tote I received has incorrect stitching, wrong font on the logo, and fake hardware. This is a clear counterfeit.",
    evidence: ["auth_report.pdf", "fake_stitching.jpg", "fake_logo.jpg"],
    assignedTo: "Agent #2",
    replies: [
      { from: "Agent #2", text: "Authentication team reviewing submitted evidence.", time: "5:00 PM" },
      { from: "Agent #2", text: "Seller account flagged for fraud review.", time: "6:22 PM" },
    ],
  },
  {
    id: "C-8818",
    category: "Unauthorized Charge",
    priority: "high",
    status: "reviewing",
    user: "sofia_c",
    userEmail: "sofia@shoppers.com",
    seller: "@quicksell22",
    listingTitle: "MacBook Pro 14in",
    amount: "$1,650",
    submittedAt: "Yesterday, 2:15 PM",
    description: "I was charged twice for the same purchase. My bank shows two $1,650 charges on the same day. Need immediate refund for the duplicate charge.",
    evidence: ["bank_statement.pdf"],
    assignedTo: "Agent #1",
    replies: [
      { from: "Agent #1", text: "Escalated to payments team. Processing refund.", time: "3:00 PM" },
    ],
  },
  {
    id: "C-8817",
    category: "Seller Harassment",
    priority: "medium",
    status: "resolved",
    user: "buyer_anon22",
    userEmail: "anon22@protonmail.com",
    seller: "@deals4u_bot",
    listingTitle: "N/A",
    amount: "N/A",
    submittedAt: "2 days ago",
    description: "After leaving a negative review, the seller sent me threatening messages. Attaching screenshots of the conversation.",
    evidence: ["threats_screenshot.png"],
    assignedTo: "Agent #3",
    replies: [
      { from: "Agent #3", text: "Seller warned and placed on restricted status.", time: "2 days ago" },
      { from: "Agent #3", text: "Case closed. Buyer confirmed satisfied with resolution.", time: "2 days ago" },
    ],
    resolution: "Seller restricted for 30 days. Buyer account flagged for protection.",
  },
  {
    id: "C-8816",
    category: "Refund Denied",
    priority: "low",
    status: "resolved",
    user: "crafts_lover",
    userEmail: "crafts@gmail.com",
    seller: "@aishacurates",
    listingTitle: "Sterling Silver Necklace",
    amount: "$68",
    submittedAt: "3 days ago",
    description: "Item was broken when it arrived. Seller refuses to refund saying it was fine when shipped.",
    evidence: ["broken_necklace.jpg"],
    assignedTo: "Agent #1",
    replies: [],
    resolution: "Buyer issued full refund from InstaMarket protection fund. Seller notified.",
  },
];

const priorityColor = { critical: "#ed4956", high: "#fd1d1d", medium: "#fcb045", low: "#0095f6" };
const statusColor = { open: "#ed4956", reviewing: "#fcb045", resolved: "#00ba7c", dismissed: "#555" };

export default function ComplaintsDashboard() {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const filtered = complaints.filter(c => {
    const matchF = filter === "all" || c.status === filter || c.priority === filter;
    const matchS = !search || c.id.includes(search) || c.user.includes(search) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const resolve = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "resolved" } : c));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: "resolved" }));
    showToast("Complaint resolved.");
  };

  const dismiss = (id) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "dismissed" } : c));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: "dismissed" }));
    showToast("Complaint dismissed.");
  };

  const sendReply = () => {
    if (!replyText.trim() || !selected) return;
    const reply = { from: "You (Agent)", text: replyText.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    const updated = complaints.map(c =>
      c.id === selected.id ? { ...c, replies: [...c.replies, reply] } : c
    );
    setComplaints(updated);
    setSelected(prev => ({ ...prev, replies: [...prev.replies, reply] }));
    setReplyText("");
    showToast("Reply sent to user.");
  };

  const counts = {
    open: complaints.filter(c => c.status === "open").length,
    reviewing: complaints.filter(c => c.status === "reviewing").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
  };

  return (
    <div className="meta-page fade-in">
      <div className="meta-page-header">
        <div className="meta-title-row">
          <div className="meta-title-icon complaints"><MessageSquare size={20} /></div>
          <div>
            <h1 className="meta-page-title">User Complaints</h1>
            <p className="meta-page-sub">Review & resolve buyer / seller disputes and claims</p>
          </div>
        </div>
        <div className="complaint-summary-chips">
          <span className="cchip open">{counts.open} Open</span>
          <span className="cchip reviewing">{counts.reviewing} Reviewing</span>
          <span className="cchip resolved">{counts.resolved} Resolved</span>
        </div>
      </div>

      <div className="complaints-layout">
        {/* Left: list */}
        <div className="complaints-list card">
          <div className="complaints-list-header">
            <div className="meta-search-wrap" style={{ flex: 1 }}>
              <Search size={13} />
              <input
                className="meta-search-input"
                placeholder="Search ID, user, category…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="meta-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="reviewing">Reviewing</option>
              <option value="resolved">Resolved</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="clist-items">
            {filtered.map(c => (
              <button
                key={c.id}
                className={`clist-item ${selected?.id === c.id ? "active" : ""} ${c.status === "resolved" ? "dim" : ""}`}
                onClick={() => setSelected(c)}
              >
                <div className="citem-top">
                  <span className="citem-id">{c.id}</span>
                  <span
                    className="risk-chip"
                    style={{ background: `${priorityColor[c.priority]}18`, color: priorityColor[c.priority], border: `1px solid ${priorityColor[c.priority]}33`, fontSize: "0.65rem" }}
                  >
                    {c.priority}
                  </span>
                  <span className="citem-time">{c.submittedAt}</span>
                </div>
                <p className="citem-category">{c.category}</p>
                <div className="citem-meta">
                  <span>@{c.user}</span>
                  <span>·</span>
                  <span>{c.amount}</span>
                  <span className="citem-status" style={{ color: statusColor[c.status] }}>● {c.status}</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="empty-state" style={{ padding: "32px 16px" }}><p>No complaints match filter.</p></div>
            )}
          </div>
        </div>

        {/* Right: detail */}
        {selected ? (
          <div className="complaint-detail card">
            <div className="cdetail-header">
              <div>
                <div className="cdetail-id-row">
                  <span className="cdetail-id">{selected.id}</span>
                  <span className="badge" style={{ background: `${statusColor[selected.status]}18`, color: statusColor[selected.status], border: `1px solid ${statusColor[selected.status]}33` }}>
                    {selected.status}
                  </span>
                  <span className="risk-chip" style={{ background: `${priorityColor[selected.priority]}18`, color: priorityColor[selected.priority], border: `1px solid ${priorityColor[selected.priority]}33` }}>
                    {selected.priority} priority
                  </span>
                </div>
                <h2 className="cdetail-cat">{selected.category}</h2>
              </div>
              {(selected.status === "open" || selected.status === "reviewing") && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn-secondary" style={{ fontSize: "0.78rem", padding: "7px 14px" }} onClick={() => dismiss(selected.id)}>
                    <XCircle size={14} /> Dismiss
                  </button>
                  <button className="btn btn-primary" style={{ fontSize: "0.78rem", padding: "7px 14px" }} onClick={() => resolve(selected.id)}>
                    <CheckCircle size={14} /> Resolve
                  </button>
                </div>
              )}
            </div>

            <div className="cdetail-grid">
              <div className="cdetail-field">
                <span className="cdf-label">Complainant</span>
                <span className="cdf-val">@{selected.user} · {selected.userEmail}</span>
              </div>
              <div className="cdetail-field">
                <span className="cdf-label">Against Seller</span>
                <span className="cdf-val">{selected.seller}</span>
              </div>
              <div className="cdetail-field">
                <span className="cdf-label">Listing</span>
                <span className="cdf-val">{selected.listingTitle}</span>
              </div>
              <div className="cdetail-field">
                <span className="cdf-label">Amount</span>
                <span className="cdf-val">{selected.amount}</span>
              </div>
              <div className="cdetail-field">
                <span className="cdf-label">Submitted</span>
                <span className="cdf-val">{selected.submittedAt}</span>
              </div>
              <div className="cdetail-field">
                <span className="cdf-label">Assigned To</span>
                <span className="cdf-val">{selected.assignedTo}</span>
              </div>
            </div>

            <div className="cdetail-desc">
              <p className="cdf-label" style={{ marginBottom: "8px" }}>User Statement</p>
              <p className="cdetail-desc-txt">"{selected.description}"</p>
            </div>

            {selected.evidence?.length > 0 && (
              <div className="cdetail-evidence">
                <p className="cdf-label" style={{ marginBottom: "8px" }}>Evidence ({selected.evidence.length} files)</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selected.evidence.map(e => (
                    <span key={e} className="evidence-chip">📎 {e}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.resolution && (
              <div className="resolution-box">
                <CheckCircle size={14} />
                <p>{selected.resolution}</p>
              </div>
            )}

            {/* Thread */}
            <div className="cdetail-thread">
              <p className="cdf-label" style={{ marginBottom: "10px" }}>Internal Thread ({selected.replies.length})</p>
              {selected.replies.length === 0 ? (
                <p className="no-replies">No replies yet. Add a note below.</p>
              ) : (
                selected.replies.map((r, i) => (
                  <div key={i} className="thread-reply">
                    <div className="thread-from">{r.from} <span className="thread-time">{r.time}</span></div>
                    <p className="thread-txt">{r.text}</p>
                  </div>
                ))
              )}
            </div>

            {(selected.status === "open" || selected.status === "reviewing") && (
              <div className="reply-box">
                <textarea
                  className="reply-input"
                  placeholder="Add an internal note or message to user…"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  rows={3}
                />
                <button className="btn btn-primary" onClick={sendReply} disabled={!replyText.trim()} style={{ fontSize: "0.82rem", padding: "8px 16px", alignSelf: "flex-end" }}>
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card complaint-detail complaint-empty">
            <MessageSquare size={36} style={{ color: "var(--text-muted)" }} />
            <p>Select a complaint to review</p>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast">
          <CheckCircle size={15} style={{ color: "var(--green)" }} />
          {toast}
        </div>
      )}
    </div>
  );
}
import "./MetaPortal.css";
