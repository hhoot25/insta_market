import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import "./Cart.css";

export default function Cart() {
  const { cart, cartTotal, removeFromCart } = useApp();
  const [paid, setPaid] = useState(null);

  if (paid) {
    return (
      <div className="page">
        <div className="success-screen">
          <div className="success-icon-wrap">
            <CheckCircle2 size={64} />
          </div>
          <h2>Payment Successful!</h2>
          <p>Paid with <strong>{paid}</strong></p>
          <p className="success-sub">
            Your order is confirmed. The seller has been notified and will ship soon.
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "8px" }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <ShoppingBag size={44} style={{ color: "var(--text-muted)" }} />
          <p>Your cart is empty</p>
          <Link to="/" className="btn btn-primary">Browse Listings</Link>
        </div>
      </div>
    );
  }

  const tax = cartTotal * 0.08;
  const shipping = 9.99;
  const total = cartTotal + tax + shipping;

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: "24px" }}>
        Cart <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 400 }}>({cart.length} items)</span>
      </h1>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item card">
              <Link to={`/product/${item.id}`} className="cart-item-img-wrap">
                <img src={item.images[0]} alt={item.title} className="cart-item-img" />
              </Link>
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`} className="cart-item-title">
                  {item.title}
                </Link>
                <span className="cart-item-condition">{item.condition}</span>
                <span className="cart-item-price">${item.price.toLocaleString()}</span>
              </div>
              <button
                className="cart-remove"
                onClick={() => removeFromCart(item.id)}
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary card">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-lines">
            <div className="summary-line">
              <span>Subtotal ({cart.length} items)</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-line total-line">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pay-buttons">
            <button className="pay-btn apple-pay" onClick={() => setPaid("Apple Pay")}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple Pay
            </button>

            <button className="pay-btn google-pay" onClick={() => setPaid("Google Pay")}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Pay
            </button>

            <div className="divider"><span>or</span></div>

            <button className="pay-btn card-pay" onClick={() => setPaid("Credit Card")}>
              <Lock size={16} />
              Pay with Card
            </button>
          </div>

          <p className="secure-note">
            <Lock size={11} /> Secured & encrypted checkout
          </p>
        </div>
      </div>
    </div>
  );
}
