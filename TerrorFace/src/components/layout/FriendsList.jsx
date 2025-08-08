// /src/components/layout/FrindsList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getAcceptedFriends, RemoveFriend } from '../../services/friendService';

export default function FriendsList() {
  const { user ,setUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      const friendsList = await getAcceptedFriends(user.id);
      setFriends(friendsList);
    } catch (error) {
      console.log('Failed to fetch friends:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await RemoveFriend(user.id, friendId);
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
      user.friends = [...friends]
      setUser(user)
    } catch (error) {
      console.log('Failed to remove friend:', error);
    }
  };

  return (
    <div className="friends-list">
      <h2>My Friends</h2>
      {friends.length === 0 ? (
        <p>You have no friends yet.</p>
      ) : (
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>
              <img src={friend.avatar} alt="avatar"  className="friend-avatar" />
              {friend.username}
              <button onClick={() => handleRemoveFriend(friend.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
