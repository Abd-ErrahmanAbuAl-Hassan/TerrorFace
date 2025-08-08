// /src/services/friendService.js

import API from './api';
import { addFriend, getUserById } from './userService';

export const sendFriendRequest = async (senderId, receiverId) => {
  const res = await API.post('/friendRequests', {
    senderId,
    receiverId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  return res.data;
};

export const cancelFriendRequest = async (senderId, receiverId) => {
  const res = await API.get(`/friendRequests?senderId=${senderId}&receiverId=${receiverId}&status=pending`);
  const request = res.data[0];
  if (request) {
    await API.delete(`/friendRequests/${request.id}`);
  }
};

export const getFriendRequests = async (userId) => {
  const res = await API.get(`/friendRequests?receiverId=${userId}&status=pending`);
  return res.data;
};

export const getSentRequests = async (userId) => {
  const res = await API.get(`/friendRequests?senderId=${userId}&status=pending`);
  return res.data;
};

export const acceptRequest = async (requestId) => {
  const res = await API.get(`/friendRequests/${requestId}`);
  const request = res.data;

  await addFriend(request.senderId, request.receiverId);
  await addFriend(request.receiverId, request.senderId);

  await API.patch(`/friendRequests/${requestId}`, { status: 'accepted' });
};

export const rejectRequest = async (requestId) => {
  await API.patch(`/friendRequests/${requestId}`, { status: 'rejected' });
};

export const getAcceptedFriends = async (userId) => {
  const userRes = await getUserById(userId);
  const friends = userRes.friends || [];

  if (friends.length === 0) return [];

  const friendsRes = await API.get(`/users?id=${friends.join("&id=")}`);
  return friendsRes.data;
};

export const RemoveFriend = async (userId, friendId) => {
  const user = await getUserById(userId);
  if (!user.friends || !user.friends.includes(friendId)) return;

  const updatedFriends = user.friends.filter(id => id !== friendId);
  await API.put(`/users/${userId}`, { ...user, friends: updatedFriends });

  const friend = await getUserById(friendId);
  const updatedFriendFriends = friend.friends.filter(id => id !== userId);
  await API.put(`/users/${friendId}`, { ...friend, friends: updatedFriendFriends });
};

export const getEnrichedFriendRequests = async (userId) => {
  const requests = await getFriendRequests(userId);
  
  const enrichedRequests = await Promise.all(
    requests.map(async (request) => {
      try {
        const sender = await getUserById(request.senderId);
        return {
          ...request,
          senderName: sender.username,
          senderAvatar: sender.avatar
        };
      } catch (error) {
        console.error('Failed to fetch sender details:', error);
        return {
          ...request,
          senderName: 'Unknown user',
          senderAvatar: '/default-avatar.png'
        };
      }
    })
  );
  
  return enrichedRequests;
};