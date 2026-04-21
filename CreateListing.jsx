import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, ImagePlus, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";
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

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target.result]);
        setForm((f) => ({
          ...f,
          images: [...f.images, ev.target.result],
        }));
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
    setTimeout(() => navigate("/listings"), 2000);
  };

  if (success) {
    return (
      <div className="page create-page">
        <div className="success-screen">
          <div className="success-icon">
            <CheckCircle2 size={52} />
          </div>
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

      <form className="create-form" onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="upload-section">
          <div
            className="upload-zone"
            onClick={() => fileRef.current.click()}
          >
            <ImagePlus size={32} style={{ color: "var(--text-muted)" }} />
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
                  <button
                    type="button"
                    className="remove-img"
                    onClick={() => removeImage(i)}
                  >
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
            <label className="form-label">Price *</label>
            <div className="price-input-wrap">
              <span className="price-symbol">$</span>
              <input
                type="number"
                className={`form-input price-input ${errors.price ? "error" : ""}`}
                placeholder="0.00"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
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
            <Upload size={16} /> Publish Listing
          </button>
        </div>
      </form>
    </div>
  );
}
