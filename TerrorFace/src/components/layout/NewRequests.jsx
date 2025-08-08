// /src/components/layout/NewRequests.jsx

import React, { useEffect, useState, useContext } from 'react';
import { getAllUsers } from '../../services/userService';
import {
  sendFriendRequest,
  cancelFriendRequest,
  getSentRequests,
  getAcceptedFriends,
  getFriendRequests
} from '../../services/friendService';
import { AuthContext } from '../../contexts/AuthContext';

export default function NewRequests() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [localRequests, setLocalRequests] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allUsers = await getAllUsers();
      const friendList = await getAcceptedFriends(user.id);
      const requests = await getSentRequests(user.id);
      const receives = await getFriendRequests(user.id)

      const friendIds = friendList.map((f) => f.id);
      const requestedIds = requests.map((r) => r.receiverId);
      const receivedIds = receives.map((c)=>c.senderId)

      setSentRequests(requestedIds);
      setLocalRequests([]); 

      setUsers(
        allUsers.filter(
          (u) =>
            u.id !== user.id &&
            !friendIds.includes(u.id) &&
            !requestedIds.includes(u.id) &&
            !receivedIds.includes(u.id) &&
            u.role === "user" 
        )
      );
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const isRequested = (userId) => {
    return sentRequests.includes(userId) || localRequests.includes(userId);
  };

  const handleAddFriend = async (receiverId) => {
    try {
      await sendFriendRequest(user.id, receiverId);
      setLocalRequests((prev) => [...prev, receiverId]); 
    } catch (err) {
      console.error('Failed to send friend request:', err);
    }
  };

  const handleCancelRequest = async (receiverId) => {
    try {
      await cancelFriendRequest(user.id, receiverId);
      setLocalRequests((prev) => prev.filter((id) => id !== receiverId));
    } catch (err) {
      console.error('Failed to cancel request:', err);
    }
  };

return (
    <div className="requests-container">
      <h2>People You May Know</h2>
      {users.length === 0 ? (
        <p className="no-requests">No new users available.</p>
      ) : (
        <div className="requests-list">
          {users.map((u) => (
            <div key={u.id} className="request-card">
              <div className="user-info">
                <img src={u.avatar} alt="avatar" className="user-avatar" />
                <div className="user-details">
                  <span className="username">{u.username}</span>
                </div>
              </div>
              {isRequested(u.id) ? (
                <button 
                  onClick={() => handleCancelRequest(u.id)}
                  className="action-btn cancel-btn"
                >
                  Cancel
                </button>
              ) : (
                <button 
                  onClick={() => handleAddFriend(u.id)}
                  className="action-btn add-btn"
                >
                  Add Friend
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
