import { useState, useRef } from "react";
import { Upload, CheckCircle2, AlertTriangle, X, ImagePlus } from "lucide-react";
import "./Support.css";

const REASONS = [
  "Select a reason...",
  "Counterfeit / Fake item",
  "Item not as described",
  "Prohibited item",
  "Suspected fraud or scam",
  "Inappropriate content",
  "Seller harassment",
  "Other",
];

export default function Support() {
  const [form, setForm] = useState({ reason: "", details: "", preview: null });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, preview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.reason || form.reason === REASONS[0]) e.reason = "Please select a reason";
    if (!form.details.trim()) e.details = "Please provide details";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page support-page">
        <div className="success-screen fade-in">
          <div className="success-check">
            <CheckCircle2 size={56} />
          </div>
          <h2>Report Submitted</h2>
          <p>Thanks for keeping InstaMarket safe. Our team will review your report within 24 hours.</p>
          <p className="ticket-id">Ticket #IM-{Math.floor(Math.random() * 90000) + 10000}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page support-page">
      <div className="support-header">
        <h1 className="page-title">Support & Reporting</h1>
        <p className="page-subtitle">Report an item, seller, or issue</p>
      </div>

      {/* Info card */}
      <div className="info-banner">
        <AlertTriangle size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
        <p>
          Reports are confidential. We take all reports seriously and aim to resolve issues within 24–48 hours.
        </p>
      </div>

      <form className="support-form" onSubmit={handleSubmit}>
        {/* Reason */}
        <div className="form-group">
          <label className="form-label">Reason for Report *</label>
          <select
            className={`form-input ${errors.reason ? "error" : ""}`}
            value={form.reason}
            onChange={(e) => { setForm((f) => ({ ...f, reason: e.target.value })); setErrors((er) => ({ ...er, reason: null })); }}
          >
            {REASONS.map((r) => (
              <option key={r} value={r === REASONS[0] ? "" : r}>{r}</option>
            ))}
          </select>
          {errors.reason && <span className="field-error">{errors.reason}</span>}
        </div>

        {/* Details */}
        <div className="form-group">
          <label className="form-label">Details *</label>
          <textarea
            className={`form-input ${errors.details ? "error" : ""}`}
            placeholder="Describe the issue in detail. Include listing ID, username, or any relevant information..."
            value={form.details}
            onChange={(e) => { setForm((f) => ({ ...f, details: e.target.value })); setErrors((er) => ({ ...er, details: null })); }}
            rows={5}
            maxLength={500}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {errors.details && <span className="field-error">{errors.details}</span>}
            <span className="char-count" style={{ marginLeft: "auto" }}>{form.details.length}/500</span>
          </div>
        </div>

        {/* Image upload */}
        <div className="form-group">
          <label className="form-label">Screenshot / Evidence (optional)</label>
          {form.preview ? (
            <div className="evidence-preview">
              <img src={form.preview} alt="Evidence" className="evidence-img" />
              <button
                type="button"
                className="remove-evidence"
                onClick={() => setForm((f) => ({ ...f, preview: null }))}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              className="upload-zone small"
              onClick={() => fileRef.current.click()}
            >
              <ImagePlus size={24} style={{ color: "var(--text-muted)" }} />
              <p>Click to upload screenshot</p>
            </div>
          )}
          <input type="file" accept="image/*" ref={fileRef} hidden onChange={handleImage} />
        </div>

        <button type="submit" className="btn btn-primary submit-report-btn">
          <AlertTriangle size={16} />
          Submit Report
        </button>
      </form>

      {/* FAQ */}
      <div className="support-faq">
        <h3 className="faq-title">Common Questions</h3>
        {[
          ["How long does review take?", "Most reports are reviewed within 24 hours. Complex cases may take up to 5 business days."],
          ["Will the seller know I reported them?", "No. All reports are anonymous. We never disclose who filed a report."],
          ["Can I report a buyer?", "Yes! Use the same form and select 'Seller harassment' or 'Other' and provide details."],
        ].map(([q, a]) => (
          <details key={q} className="faq-item">
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
