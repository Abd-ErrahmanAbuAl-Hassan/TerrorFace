// /src/contexts/FriendRequestContext.jsx

import React, { createContext, useState, useContext } from 'react';

const FriendRequestContext = createContext();

export function FriendRequestProvider({ children }) {
  const [requests, setRequests] = useState([]);
  
  const updateRequests = (newRequests) => {
    setRequests(newRequests);
  };

  const removeRequest = (requestId) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  return (
    <FriendRequestContext.Provider value={{ 
      requests, 
      updateRequests, 
      removeRequest 
    }}>
      {children}
    </FriendRequestContext.Provider>
  );
}

export const useFriendRequests = () => {
  return useContext(FriendRequestContext);
};