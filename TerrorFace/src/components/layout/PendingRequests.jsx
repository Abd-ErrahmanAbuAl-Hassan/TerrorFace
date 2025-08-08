// /src/components/layout/PendingRequests.jsx

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { cancelFriendRequest, getSentRequests, sendFriendRequest } from '../../services/friendService';
import { getUserById } from '../../services/userService';

export default function PendingRequests() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [cancelledRequests, setCancelledRequests] = useState([]);

  useEffect(() => {
    fetchPendingSentRequests();
  }, []);

  const fetchPendingSentRequests = async () => {
    try {
      const requests = await getSentRequests(user.id);
      const receivers = await Promise.all(
        requests.map(async (req) => {
          const receiverRes = await getUserById(req.receiverId);
          return { ...receiverRes, isPending: true };
        })
      );
      setUsers(receivers);
      setCancelledRequests([]);
    } catch (error) {
      console.error("Error fetching pending sent requests:", error);
    }
  };

  const isCancelled = (userId) => {
    return cancelledRequests.includes(userId);
  };

  const handleCancelRequest = async (receiverId) => {
    try {
      await cancelFriendRequest(user.id, receiverId);
      setCancelledRequests(prev => [...prev, receiverId]);
    } catch (err) {
      console.error('Failed to cancel request:', err);
    }
  };

  const handleResendRequest = async (receiverId) => {
    try {
      await sendFriendRequest(user.id, receiverId);
      setCancelledRequests(prev => prev.filter(id => id !== receiverId));
    } catch (err) {
      console.error('Failed to resend request:', err);
    }
  };

  return (
    <div className="requests-container">
      <h2>Your Pending Requests</h2>
      {users.length === 0 ? (
        <p className="no-requests">No pending friend requests.</p>
      ) : (
        <div className="requests-list">
          {users.map(u => (
            <div key={u.id} className="request-card">
              <div className="user-info">
                <img src={u.avatar} alt="avatar" className="user-avatar" />
                <div className="user-details">
                  <span className="username">{u.username}</span>
                </div>
              </div>
              {isCancelled(u.id) ? (
                <button 
                  onClick={() => handleResendRequest(u.id)}
                  className="action-btn resend-btn"
                >
                  ↻ Resend
                </button>
              ) : (
                <button 
                  onClick={() => handleCancelRequest(u.id)}
                  className="action-btn cancel-btn"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}