import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "./TOS.css";

const SECTIONS = [
  {
    title: "1. Marketplace Rules",
    body: `InstaMarket connects buyers and sellers within the Instagram ecosystem. By using InstaMarket you agree to purchase only through legitimate channels and to provide accurate information during checkout. Attempting to manipulate listings, exploit pricing errors, or conduct transactions outside the platform to avoid fees or protections is strictly prohibited. Accounts found in violation will be suspended without notice.`,
  },
  {
    title: "2. Purchases & Payments",
    body: `All purchases made through InstaMarket are final unless the seller has explicitly stated a return policy in their listing, or the item is covered under InstaMarket Buyer Protection. By completing a purchase you confirm that you have reviewed the listing description, photos, and condition details. Chargebacks initiated outside of InstaMarket's dispute process may result in account restrictions.`,
  },
  {
    title: "3. Buyer Protection",
    body: `InstaMarket Buyer Protection covers eligible purchases where the item does not arrive, arrives significantly not as described, or is confirmed counterfeit by our authentication team. To file a claim you must report the issue within 72 hours of the confirmed delivery date. Protection does not apply to transactions conducted off-platform, change-of-mind returns, or items explicitly sold as-is with disclosed defects.`,
  },
  {
    title: "4. Prohibited Purchases",
    body: `You may not use InstaMarket to purchase weapons, firearms, ammunition, controlled substances, stolen property, counterfeit goods, adult content, live animals, or any item prohibited by applicable law in your jurisdiction. Attempting to purchase prohibited items will result in immediate account termination and may be reported to relevant authorities.`,
  },
  {
    title: "5. Data & Privacy",
    body: `InstaMarket collects and processes data about your purchases, browsing behavior, search history, and account activity in accordance with Meta's Privacy Policy. This data is used to personalize recommendations, detect fraud, resolve disputes, and improve the platform. You can review, export, or request deletion of your personal data at any time through your account settings.`,
  },
  {
    title: "6. Reviews & Community",
    body: `After completing a purchase you may leave a review of the seller and item. Reviews must be honest, based on your genuine experience, and must not contain personal attacks, hate speech, or false claims. InstaMarket reserves the right to remove reviews that violate these guidelines. Attempting to manipulate seller ratings — including through coordinated reviewing or incentivized reviews — is prohibited.`,
  },
  {
    title: "7. Limitation of Liability",
    body: `InstaMarket and Meta are not liable for the quality, safety, legality, or availability of items listed on the platform. To the fullest extent permitted by law, Meta's total liability to you for any claim arising from use of InstaMarket shall not exceed the amount paid by you for the specific transaction giving rise to the claim. Nothing in these terms limits liability for fraud, death, or personal injury caused by our negligence.`,
  },
  {
    title: "8. Changes to These Terms",
    body: `InstaMarket may update these Terms of Service at any time. When we make material changes we will notify you via email or in-app notification at least 30 days before the changes take effect. Your continued use of InstaMarket after the effective date constitutes acceptance of the updated terms. If you do not agree you must stop using the platform and may request account deletion through your settings.`,
  },
];

export default function TOS() {
  const { acceptTOS, logout } = useAuth();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [checked, setChecked] = useState(false);
  const scrollRef = useRef();

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 48) {
      setScrolledToBottom(true);
    }
  };

  const canAccept = scrolledToBottom && checked;

  return (
    <div className="tos-root">
      <div className="tos-card">

        {/* Header — fixed, never scrolls */}
        <div className="tos-header">
          <div className="tos-logo">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <defs>
                <linearGradient id="tg" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#f09433"/>
                  <stop offset="50%"  stopColor="#dc2743"/>
                  <stop offset="100%" stopColor="#bc1888"/>
                </linearGradient>
              </defs>
              <path fill="url(#tg)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <div>
              <p className="tos-logo-name">InstaMarket</p>
              <p className="tos-logo-sub">from Meta</p>
            </div>
          </div>
          <h1 className="tos-title">Buyer Terms of Service</h1>
          <p className="tos-subtitle">
            One last step — read through the terms, then check the box below to activate your account.
            Last updated January 15, 2025.
          </p>
        </div>

        {/* Scrollable body — flex: 1 + min-height: 0 is the key to making this work */}
        <div className="tos-body" ref={scrollRef} onScroll={handleScroll}>
          <p className="tos-intro">
            Welcome to InstaMarket. These Buyer Terms of Service govern your access to and use of InstaMarket. By creating an account and making purchases you agree to be bound by these terms, Meta's Community Standards, and the Instagram Terms of Use. If you do not agree, you may not use InstaMarket.
          </p>

          {SECTIONS.map(s => (
            <div key={s.title} className="tos-section">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}

          <div className="tos-end-block">
            <p>
              These Terms constitute the entire agreement between you and Meta regarding your use of InstaMarket as a buyer.
              For questions contact <strong>support-instamarket@meta.com</strong>.
            </p>
          </div>
        </div>

        {/* Footer — fixed, never scrolls */}
        <div className="tos-footer">
          {!scrolledToBottom && (
            <p className="tos-scroll-notice">↓ Scroll to the bottom to unlock acceptance</p>
          )}

          <label className={`tos-checkbox-row ${!scrolledToBottom ? "tos-locked" : ""}`}>
            <input
              type="checkbox"
              className="tos-checkbox"
              checked={checked}
              disabled={!scrolledToBottom}
              onChange={e => setChecked(e.target.checked)}
            />
            <span>
              I have read and agree to the InstaMarket Buyer Terms of Service, Meta's{" "}
              <span className="tos-link">Privacy Policy</span>, and{" "}
              <span className="tos-link">Community Standards</span>.
            </span>
          </label>

          <div className="tos-buttons">
            <button className="tos-decline-btn" onClick={logout}>
              ← Go Back
            </button>
            <button
              className={`tos-accept-btn ${canAccept ? "tos-accept-ready" : ""}`}
              disabled={!canAccept}
              onClick={() => canAccept && acceptTOS()}
            >
              Accept &amp; Continue
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
