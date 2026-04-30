import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [tosAccepted, setTosAccepted] = useState(false);

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
    setTosAccepted(false); // always show TOS on fresh login
    return user;
  };

  const acceptTOS = () => setTosAccepted(true);

  const logout = () => {
    setAuthUser(null);
    setTosAccepted(false);
    window.history.replaceState(null, "", "/");
  };

  return (
    <AuthContext.Provider value={{ authUser, tosAccepted, login, acceptTOS, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
