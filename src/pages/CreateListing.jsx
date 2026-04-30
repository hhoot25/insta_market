import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, ImagePlus, CheckCircle2, Sparkles, TrendingUp, ChevronRight, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";
import { getSuggestion } from "../data/aiPricingSuggestions";
import "./CreateListing.css";

const CONDITIONS = ["New", "Like New", "Excellent", "Very Good", "Good"];

export default function CreateListing() {
  const { addListing } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "fashion",
    condition: "New",
    images: [],
  });
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  // AI suggestion state
  const [aiState, setAiState] = useState("idle"); // idle | analyzing | done
  const [suggestion, setSuggestion] = useState(null);
  const [appliedPrice, setAppliedPrice] = useState(false);

  // Trigger AI analysis whenever category or condition changes
  // and we have enough content to "analyze"
  useEffect(() => {
    const hasContent = form.title.trim().length > 2 || form.description.trim().length > 5 || previews.length > 0;
    if (!hasContent) return;

    setAiState("analyzing");
    setAppliedPrice(false);
    setSuggestion(null);

    const timer = setTimeout(() => {
      const result = getSuggestion(form.category, form.condition);
      setSuggestion(result);
      setAiState("done");
    }, 1400);

    return () => clearTimeout(timer);
  }, [form.category, form.condition]);

  // Also trigger when user finishes typing title or description
  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));

    if ((field === "title" && value.trim().length === 3) ||
        (field === "description" && value.trim().length === 10)) {
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setAiState("analyzing");
    setAppliedPrice(false);
    setSuggestion(null);
    setTimeout(() => {
      const result = getSuggestion(form.category, form.condition);
      setSuggestion(result);
      setAiState("done");
    }, 1600);
  };

  const handleApplyPrice = () => {
    setForm((f) => ({ ...f, price: suggestion.price.toString() }));
    setErrors((e) => ({ ...e, price: null }));
    setAppliedPrice(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target.result]);
        setForm((f) => ({ ...f, images: [...f.images, ev.target.result] }));
        // Trigger analysis when first image is uploaded
        if (previews.length === 0) triggerAnalysis();
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (!form.description.trim()) e.description = "Add a description";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    addListing({
      ...form,
      price: Number(form.price),
      originalPrice: null,
      images: previews.length > 0
        ? previews
        : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
      tags: form.title.toLowerCase().split(" ").filter((w) => w.length > 3),
    });

    setSuccess(true);
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  if (success) {
    return (
      <div className="page create-page">
        <div className="success-screen">
          <div className="success-icon"><CheckCircle2 size={52} /></div>
          <h2>Listing Created!</h2>
          <p>Your item is now live on InstaMarket.</p>
          <p className="redirecting">Redirecting to your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page create-page">
      <div className="create-header">
        <h1 className="page-title">Create Listing</h1>
        <p className="page-subtitle">List your item in under 2 minutes</p>
      </div>

      <div className="create-layout">
        <form className="create-form" onSubmit={handleSubmit}>

          {/* Image Upload */}
          <div className="upload-section">
            <div className="upload-zone" onClick={() => fileRef.current.click()}>
              <ImagePlus size={30} style={{ color: "var(--text-muted)" }} />
              <p>Click to upload photos</p>
              <span>JPG, PNG up to 10MB each</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageUpload}
            />
            {previews.length > 0 && (
              <div className="image-previews">
                {previews.map((src, i) => (
                  <div key={i} className="preview-wrap">
                    <img src={src} alt={`Preview ${i + 1}`} className="preview-img" />
                    <button type="button" className="remove-img" onClick={() => removeImage(i)}>
                      <X size={12} />
                    </button>
                    {i === 0 && <span className="cover-label">Cover</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-grid">
            {/* Title */}
            <div className="form-group full-width">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className={`form-input ${errors.title ? "error" : ""}`}
                placeholder="e.g. Nike Air Jordan 1 Retro High"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                maxLength={100}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">
                Price *
                {appliedPrice && (
                  <span className="ai-applied-tag">
                    <Sparkles size={10} /> AI suggested
                  </span>
                )}
              </label>
              <div className="price-input-wrap">
                <span className="price-symbol">$</span>
                <input
                  type="number"
                  className={`form-input price-input ${errors.price ? "error" : ""} ${appliedPrice ? "price-ai-applied" : ""}`}
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => { handleChange("price", e.target.value); setAppliedPrice(false); }}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>

            {/* Condition */}
            <div className="form-group">
              <label className="form-label">Condition *</label>
              <div className="condition-pills">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`condition-pill ${form.condition === c ? "active" : ""}`}
                    onClick={() => handleChange("condition", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                {categories.filter((c) => c.id !== "all").map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label">Description *</label>
              <textarea
                className={`form-input ${errors.description ? "error" : ""}`}
                placeholder="Describe your item — condition details, measurements, authenticity info..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={5}
                maxLength={1000}
              />
              {errors.description && <span className="field-error">{errors.description}</span>}
              <span className="char-count">{form.description.length}/1000</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Upload size={15} /> Publish Listing
            </button>
          </div>
        </form>

        {/* ── AI Pricing Panel ── */}
        <div className="ai-panel">
          <div className="ai-panel-header">
            <div className="ai-panel-title">
              <div className="ai-icon-wrap">
                <Sparkles size={15} />
              </div>
              <div>
                <p className="ai-title-text">AI Price Advisor</p>
                <p className="ai-title-sub">Powered by InstaMarket Intelligence</p>
              </div>
            </div>
            {aiState === "done" && (
              <button className="ai-refresh-btn" onClick={triggerAnalysis} title="Re-analyze">
                <RefreshCw size={13} />
              </button>
            )}
          </div>

          {/* Idle — not enough info yet */}
          {aiState === "idle" && (
            <div className="ai-idle">
              <p>Fill in your title, description, category, and condition — the AI will analyze your listing and suggest the optimal price.</p>
            </div>
          )}

          {/* Analyzing */}
          {aiState === "analyzing" && (
            <div className="ai-analyzing">
              <div className="ai-analyzing-dots">
                <span /><span /><span />
              </div>
              <div className="ai-analyzing-steps">
                <p className="ai-step active">Scanning category market data...</p>
                <p className="ai-step">Analyzing condition signals...</p>
                <p className="ai-step">Comparing recent sold listings...</p>
                <p className="ai-step">Calculating optimal price...</p>
              </div>
            </div>
          )}

          {/* Result */}
          {aiState === "done" && suggestion && (
            <div className="ai-result fade-in">
              {/* Confidence bar */}
              <div className="ai-confidence-row">
                <span className="ai-confidence-label">Confidence</span>
                <div className="ai-confidence-track">
                  <div
                    className="ai-confidence-fill"
                    style={{ width: `${suggestion.confidence}%` }}
                  />
                </div>
                <span className="ai-confidence-pct">{suggestion.confidence}%</span>
              </div>

              {/* Suggested price */}
              <div className="ai-price-block">
                <p className="ai-price-label">Suggested Price</p>
                <p className="ai-price-value">${suggestion.price.toLocaleString()}</p>
                <p className="ai-price-range">
                  Market range: <strong>${suggestion.low}–${suggestion.high}</strong>
                </p>
              </div>

              {/* Apply button */}
              <button
                className={`ai-apply-btn ${appliedPrice ? "applied" : ""}`}
                onClick={handleApplyPrice}
                disabled={appliedPrice}
              >
                {appliedPrice ? (
                  <><CheckCircle2 size={14} /> Price Applied</>
                ) : (
                  <><ChevronRight size={14} /> Use This Price</>
                )}
              </button>

              {/* Signals */}
              <div className="ai-signals">
                <p className="ai-signals-label">Why this price?</p>
                <ul className="ai-signals-list">
                  {suggestion.signals.map((s, i) => (
                    <li key={i}>
                      <TrendingUp size={11} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="ai-disclaimer">
                Suggestions are based on recent market activity and listing attributes. Final pricing is always up to you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
