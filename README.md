# InstaMarket

A social e-commerce frontend prototype inspired by Instagram Marketplace, built with React 18 and Vite. Includes a full buyer/seller marketplace experience and a separate internal portal for Meta Trust & Safety employees.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Login

| Account type | How to trigger | Lands on |
|---|---|---|
| Buyer / Seller | Any non-Meta email | Buyer TOS → Marketplace |
| Meta Employee | Any `@meta.com` email | Internal portal (no TOS) |

Demo accounts are available on the login screen. New signups must complete a CAPTCHA challenge, set a minimum 10-character password, and accept the Buyer Terms of Service before accessing the app. Returning users skip the TOS on subsequent logins.

---

## Marketplace (regular users)

### Discover
Searchable, filterable product grid. Filter by category (Fashion, Sneakers, Electronics, Jewelry, Home, Art, Vintage), sort by recency, popularity, or price, and search across titles, descriptions, and tags.

### Product Detail
Image carousel with thumbnails, condition badge, sustainability badge (if applicable), view and save counts, seller panel with rating and stats, and three action buttons: Buy Now, Add to Cart, and Message (non-functional placeholder).

### Seller Hub
Two-tab dashboard for sellers.

- **Analytics tab** — KPI cards (views, saves, revenue, orders), 7-day area chart for views and saves, bar chart for daily revenue, and a quick-stats row showing active listings, sold items, average price, and total saves.
- **My Listings tab** — Responsive grid of all seller listings. Each card shows the cover photo, condition badge, title, price, and stats. Inline actions: Edit (opens a modal with live-editable fields), Mark as Sold, and Delete. An Add New Listing card at the end links to the create form.

### Create Listing
Form with image upload preview, title, price, condition pill selector, category dropdown, description, and a plastic-free packaging toggle. Includes a mock **AI Price Advisor** panel that simulates ML analysis using hardcoded category and condition data to suggest an optimal price with a confidence score, market range, and contributing signals.

### Cart & Checkout
Cart item list with order summary (subtotal, shipping, tax). Mock payment buttons for Apple Pay, Google Pay, and credit card — all show a success confirmation screen on click.

### Wishlist
Grid of hearted listings with prices, savings callouts, and Add to Cart actions. Total wishlist value shown in the header.

### Profile
Avatar, bio, rating, location, and stats. Two tabs: active listings and saved items.

### Support
Report form with reason dropdown, description field, and optional screenshot upload. Submitting shows a success state with a mock ticket number and an FAQ accordion below.

---

## Meta Employee Portal (`@meta.com` only)

Separate layout with its own sidebar and a confidential environment banner. No access to marketplace routes.

### Fraud Detection
KPI row, a 7-day area chart of flagged vs resolved signals, and a pie chart of fraud by category. Below the charts, each flagged listing appears as a row with four columns:

1. **Listing photo** — thumbnail pulled from the actual listing, with a direct link to the product page
2. **Reason for fraud score** — plain-language bullet list of all contributing signals
3. **Fraud score** — circular SVG ring gauge, color-coded by risk level (green / amber / red)
4. **Action button** — opens a modal with three choices: Suspend Seller & Remove Listing, Issue Warning, or Dismiss as False Positive

Rows are filterable by status and risk level and searchable by flag ID, seller, or fraud type.

### User Complaints
Split-panel layout. Left panel is a scrollable complaint list with priority badge, status, category, and amount. Clicking a complaint loads the full detail view: complainant info, seller info, listing, amount, user statement, evidence files, and an internal agent reply thread. Active complaints have a reply box and Resolve / Dismiss buttons.

---

## Tech Stack

- **React 18** + Vite
- **React Router v6** — client-side routing
- **Recharts** — analytics charts
- **Lucide React** — icons
- **CSS custom properties** — dark theme, no CSS framework
- **Context API** — `AuthContext` (session + routing), `AppContext` (cart, wishlist, listings)
- **Mock data only** — no backend, no API calls, no database in this prototype

---

## Notes

- All state is in-memory. Refreshing the page resets everything.
- The logged-in seller is Sofia Chen by default.
- Fraud flags in the Meta portal reference real listing IDs from the mock data, so listing photos and titles match what buyers see in the marketplace.
- The AI pricing advisor uses hardcoded prices per category and condition presented with a simulated analysis delay to demonstrate the intended UX.
- Plastic-free packaging is a seller-declared field. Listings flagged as plastic-free show a 🌿 badge on the product card and detail page.
