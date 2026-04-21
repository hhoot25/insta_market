import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import MetaLayout from "./components/MetaLayout";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import CreateListing from "./pages/CreateListing";
import Cart from "./pages/Cart";
import Messages from "./pages/Messages";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import "./App.css";

function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buyer" element={<Navigate to="/" replace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

function AuthGate() {
  const { authUser } = useAuth();

  if (!authUser) {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<CreateAccount />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

  if (authUser.isMeta) {
    return (
      <Routes>
        <Route path="/meta/*" element={<MetaLayout />} />
        <Route path="*" element={<Navigate to="/meta/fraud" replace />} />
      </Routes>
    );
  }

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