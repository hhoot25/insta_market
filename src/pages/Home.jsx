import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/mockData";
import { useApp } from "../context/AppContext";
import "./Home.css";

const SEARCH_STORAGE_KEY = "instamarket_search_history";

export default function Home() {
  const { listings } = useApp();

  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [localQuery, setLocalQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEY) || "[]");
    setSearchHistory(stored);
  }, []);

  const saveSearch = (query) => {
    if (!query) return;
    const updated = [query, ...searchHistory.filter((item) => item !== query)].slice(0, 6);
    setSearchHistory(updated);
    localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(updated));
  };

  const filtered = useMemo(() => {
    let result = [...listings];

    if (submittedQuery) {
      const q = submittedQuery.toLowerCase();
      result = result.filter((l) => {
        const titleMatch = l.title.toLowerCase().includes(q);
        const descriptionMatch = l.description.toLowerCase().includes(q);
        const tagMatch = l.tags?.some((t) => t.toLowerCase().includes(q));
        const categoryMatch = l.category.toLowerCase().includes(q);
        return titleMatch || descriptionMatch || tagMatch || categoryMatch;
      });
    }

    if (activeCategory !== "all") {
      result = result.filter((l) => l.category === activeCategory);
    }

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "popular") result.sort((a, b) => b.saves - a.saves);
    else result.sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));

    return result;
  }, [listings, submittedQuery, activeCategory, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = localQuery.trim();
    setSubmittedQuery(q);
    saveSearch(q);
  };

  const clearSearch = () => {
    setLocalQuery("");
    setSubmittedQuery("");
  };

  return (
    <div className="page">
      <div className="home-hero">
        <h1 className="home-title">
          Browse <span>Marketplace</span>
        </h1>
        <p className="home-subtitle">
          Search listings by name, category, seller keywords, or tags.
        </p>

        <form className="home-search" onSubmit={handleSearch}>
          <Search size={18} className="home-search-icon" />
          <input
            type="text"
            placeholder="Search items, categories, or keywords..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="home-search-input"
          />
          {localQuery && (
            <button type="button" className="search-clear" onClick={clearSearch}>
              ✕
            </button>
          )}
          <button type="submit" className="btn btn-primary search-btn">
            Search
          </button>
        </form>

        {searchHistory.length > 0 && (
          <div style={{ marginTop: "14px" }}>
            <p
              style={{
                fontSize: "0.9rem",
                marginBottom: "8px",
                color: "var(--text-muted)",
              }}
            >
              Recent searches
            </p>
            <div className="category-scroll">
              {searchHistory.map((item) => (
                <button
                  key={item}
                  className="cat-pill"
                  onClick={() => {
                    setLocalQuery(item);
                    setSubmittedQuery(item);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="buyer-layout">
        <aside className="buyer-sidebar">
          <h3>Categories</h3>
          <div className="buyer-sidebar-list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-pill ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="buyer-results">
          <div className="results-header">
            <span className="results-count">
              <strong>{filtered.length}</strong>{" "}
              {submittedQuery ? `results for "${submittedQuery}"` : "listings"}
            </span>

            <div className="sort-wrap">
              <SlidersHorizontal size={14} style={{ color: "var(--text-muted)" }} />
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map((listing) => (
                <ProductCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Item not found.</p>
              <button className="btn btn-secondary" onClick={clearSearch}>
                Clear search
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}