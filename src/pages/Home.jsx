import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Flame, TrendingUp } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/mockData";
import { useApp } from "../context/AppContext";
import "./Home.css";

export default function Home() {
  const { listings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [localQuery, setLocalQuery] = useState(searchParams.get("q") || "");

  const query = searchParams.get("q") || "";

  const filtered = useMemo(() => {
    let result = [...listings];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.tags.some((t) => t.includes(q)) ||
          l.category.includes(q)
      );
    }
    if (activeCategory !== "all") {
      result = result.filter((l) => l.category === activeCategory);
    }
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "popular") result.sort((a, b) => b.saves - a.saves);
    else result.sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));
    return result;
  }, [listings, query, activeCategory, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) setSearchParams({ q: localQuery.trim() });
    else setSearchParams({});
  };

  const clearSearch = () => {
    setLocalQuery("");
    setSearchParams({});
  };

  return (
    <div className="page">
      {/* Hero */}
      <div className="home-hero">
        <h1 className="home-title">
          Discover <span>unique</span> finds
        </h1>
        <p className="home-subtitle">
          Buy and sell fashion, sneakers, electronics & more
        </p>
        <form className="home-search" onSubmit={handleSearch}>
          <Search size={18} className="home-search-icon" />
          <input
            type="text"
            placeholder="Search listings..."
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
      </div>

      {/* Category Pills */}
      <div className="category-scroll">
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

      {/* Sort & Results */}
      <div className="results-header">
        <span className="results-count">
          {query ? (
            <>
              <strong>{filtered.length}</strong> results for "{query}"
            </>
          ) : (
            <>
              <Flame size={16} style={{ color: "var(--accent)" }} />
              <strong>{filtered.length}</strong> listings
            </>
          )}
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

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map((listing) => (
            <ProductCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No listings found{query ? ` for "${query}"` : ""}.</p>
          <button className="btn btn-secondary" onClick={clearSearch}>
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
