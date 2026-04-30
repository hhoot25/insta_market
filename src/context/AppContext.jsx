import { createContext, useContext, useState } from "react";
import { listings as initialListings, currentUser } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const favorites = wishlist; // alias
  const [listings, setListings] = useState(initialListings);
  const [user] = useState(currentUser);

  const addToCart = (listing) => {
    setCart((prev) => {
      if (prev.find((i) => i.id === listing.id)) return prev;
      return [...prev, { ...listing, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleFavorite = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const addToWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev : [...prev, id]);
  const removeFromWishlist = (id) => setWishlist(prev => prev.filter(f => f !== id));

  const addListing = (listing) => {
    const newListing = {
      ...listing,
      id: `l${Date.now()}`,
      sellerId: user.id,
      views: 0,
      saves: 0,
      sold: false,
      listedAt: new Date().toISOString().split("T")[0],
    };
    setListings((prev) => [newListing, ...prev]);
  };

  const updateListing = (id, updates) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const deleteListing = (id) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        cartTotal,
        wishlist,
        favorites,
        listings,
        user,
        addToCart,
        removeFromCart,
        toggleFavorite,
        addToWishlist,
        removeFromWishlist,
        addListing,
        updateListing,
        deleteListing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
