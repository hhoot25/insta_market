# InstaMarket — Social E-Commerce Frontend MVP

A beautiful, fully-functional React frontend prototype inspired by Instagram Marketplace.

## ✨ Features

- **Discover Page** — Product grid with search, category filters, and sort
- **Product Detail** — Image carousel, buy flow, seller panel, favorites
- **Seller Dashboard** — KPI cards + live Recharts analytics (area & bar charts)
- **Listing Manager** — Table view with edit / delete / mark-as-sold actions
- **Create Listing** — Image upload preview, form validation, instant publish
- **Cart & Checkout** — Apple Pay / Google Pay mock payment flow
- **Messaging** — Real-time-style chat UI with auto-reply bot
- **Support / Report** — Report form with image upload + FAQ accordion
- **Profile** — Avatar, stats, listings & saved tabs

## 🛠 Tech Stack

- **React 18** + Vite
- **React Router v6** — client-side routing
- **Recharts** — analytics charts
- **Lucide React** — icons
- **CSS Custom Properties** — theming (dark mode by default)
- **Context API** — global state (cart, favorites, listings)
- **Mock Data** — all data is local, zero backend required

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## 📁 Project Structure

```
src/
├── data/mockData.js        # Users, listings, messages, analytics
├── context/AppContext.jsx  # Global state provider
├── components/
│   ├── Navbar.jsx          # Sidebar (desktop) + bottom nav (mobile)
│   ├── ProductCard.jsx     # Image card with heart toggle
│   ├── KPIBox.jsx          # Stat/metric card
│   └── SellerPanel.jsx     # Seller info panel
└── pages/
    ├── Home.jsx            # Discover feed
    ├── ProductDetail.jsx   # Product page
    ├── Dashboard.jsx       # Seller analytics
    ├── Listings.jsx        # Listing manager
    ├── CreateListing.jsx   # New listing form
    ├── Cart.jsx            # Cart + checkout
    ├── Messages.jsx        # Chat UI
    ├── Support.jsx         # Report form
    └── Profile.jsx         # User profile
```

## 📱 Responsive

- Desktop: sidebar navigation
- Mobile: bottom tab bar

## 🎨 Design System

Dark theme with CSS variables. Primary accent: `#ff385c`. Fonts: Playfair Display (headings) + DM Sans (body).
