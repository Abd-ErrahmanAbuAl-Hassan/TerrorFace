// /src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('tfaceUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false)
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('tfaceUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tfaceUser');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('tfaceUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,updateUser,setUser ,loading}}>
      {children}
    </AuthContext.Provider>
  );
}

