import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [tosAccepted, setTosAccepted] = useState(false);

  // Login — existing users skip TOS
  const login = (email, password) => {
    const isMeta = email.toLowerCase().endsWith("@meta.com");
    const user = {
      email,
      isMeta,
      name: isMeta
        ? email.split("@")[0].replace(".", " ").replace(/\b\w/g, c => c.toUpperCase())
        : email.split("@")[0],
      role: isMeta ? "meta_employee" : "user",
    };
    setAuthUser(user);
    setTosAccepted(true); // existing users already accepted TOS
    return user;
  };

  // Signup — new users must accept TOS before continuing
  const signup = (name, email, password) => {
    const user = {
      email,
      isMeta: false,
      name: name.trim() || email.split("@")[0],
      role: "user",
    };
    setAuthUser(user);
    setTosAccepted(false); // force TOS screen after signup
    return user;
  };

  const acceptTOS = () => setTosAccepted(true);

  const logout = () => {
    setAuthUser(null);
    setTosAccepted(false);
    window.history.replaceState(null, "", "/");
  };

  return (
    <AuthContext.Provider value={{ authUser, tosAccepted, login, signup, acceptTOS, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
