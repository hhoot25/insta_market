import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();

const ALLOWED_USERS = {
  "abc123@gmail.com": {
    email: "abc123@gmail.com",
    password: "demo1234",
    isMeta: false,
    name: "abc123",
    role: "buyer",
    redirectTo: "/",
  },
  "abc123@meta.com": {
    email: "abc123@meta.com",
    password: "demo1234",
    isMeta: true,
    name: "abc123",
    role: "meta_employee",
    redirectTo: "/support",
  },
};

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const register = (formData) => {
    const newUser = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      username: formData.username.trim(),
      contact: formData.contact.trim(),
      password: formData.password,
      birthdate: formData.birthdate,
      isMeta: false,
      role: "buyer",
      redirectTo: "/",
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    const allowedUser = ALLOWED_USERS[normalizedEmail];
    if (allowedUser) {
      if (allowedUser.password !== password) {
        return { ok: false, error: "Incorrect password." };
      }
      setAuthUser(allowedUser);
      return { ok: true, user: allowedUser };
    }

    const registeredUser = registeredUsers.find(
      (user) =>
        user.contact.toLowerCase() === normalizedEmail ||
        user.username.toLowerCase() === normalizedEmail
    );

    if (registeredUser) {
      if (registeredUser.password !== password) {
        return { ok: false, error: "Incorrect password." };
      }
      setAuthUser(registeredUser);
      return { ok: true, user: registeredUser };
    }

    return {
      ok: false,
      error:
        "Unauthorized account. Use abc123@gmail.com or abc123@meta.com, or create a normal user account first.",
    };
  };

  const logout = () => {
    setAuthUser(null);
    window.history.replaceState(null, "", "/");
  };

  const value = useMemo(
    () => ({
      authUser,
      login,
      logout,
      register,
      registeredUsers,
    }),
    [authUser, registeredUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);