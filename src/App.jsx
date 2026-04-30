import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import MetaLayout from "./components/MetaLayout";
import Login from "./pages/Login";
import TOS from "./pages/TOS";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import CreateListing from "./pages/CreateListing";
import Cart from "./pages/Cart";
import Support from "./pages/Support";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import "./App.css";

function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/support" element={<Support />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

function AuthGate() {
  const { authUser, tosAccepted } = useAuth();

  // Not logged in → show login
  if (!authUser) return <Login />;

  // Meta employee → internal portal
  if (authUser.isMeta) {
    return (
      <Routes>
        <Route path="/meta/*" element={<MetaLayout />} />
        <Route path="*" element={<Navigate to="/meta/fraud" replace />} />
      </Routes>
    );
  }

  // Logged in but TOS not yet accepted → show TOS
  if (!tosAccepted) return <TOS />;

  // Regular user → marketplace
  return <AppLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AuthGate />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
