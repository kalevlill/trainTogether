import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data);
        setUser(res.data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout, setToken }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;