// /src/services/userService.js

import API from './api';
import { generateAvatar } from '../utils/avatarGenerator';

export const getAllUsers = async () => {
  const res = await API.get('/users');
  return res.data;
};

export const getUserById = async (id) => {
  try {
    const res = await API.get(`/users/${id}`);
    return res.data;
  } catch (e) {
    throw new Error(`User with ID ${id} not found or an error occurred: ${e.message}`);
  }
};

export const promoteUser = async (id) => {
  try {
    const res = await API.patch(`/users/${id}`, { role: 'admin' });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to promote user with ID ${id}: ${error.message}`);
  }
};

export const RevokePromotion = async (id) => {
  try {
    const res = await API.patch(`/users/${id}`, { role: 'user' });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to revoke promotion for user with ID ${id}: ${error.message}`);
  }
};

export const addFriend = async (userId, friendId) => {
  const user = await getUserById(userId);
  const updatedFriends = user.friends || [];

  if (!updatedFriends.includes(friendId)) {
    updatedFriends.push(friendId);
    await API.put(`/users/${userId}`, { ...user, friends: updatedFriends });
  }
};

export const createUser = async (userData) => {
  try {
    const emailCheck = await API.get(`/users?email=${userData.email}`);
    if (emailCheck.data.length > 0) {
      throw new Error('Email already registered');
    }

    const id = userData.id || Math.random().toString(36).substring(2, 6) + 
      Math.random().toString(36).substring(2, 6);

    const newUser = {
      id,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user',
      friends: [],
      avatar: userData.avatar || generateAvatar(userData.username || 'User'),
      createdAt: new Date().toISOString()
    };

    const res = await API.post('/users', newUser);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export const deleteUser = async (id) => {
  try {
    const userRes = await API.get(`/users/${id}`);
    const user = userRes.data;

    if (user.role === 'superadmin') {
      throw new Error('Cannot delete a superadmin user');
    }

    const userPosts = await API.get(`/posts?userId=${id}`);
    await Promise.all(userPosts.data.map(post => 
      API.delete(`/posts/${post.id}`)
    ));

    const allUsers = await API.get('/users');
    await Promise.all(allUsers.data.map(async u => {
      if (u.friends.includes(id)) {
        const updatedFriends = u.friends.filter(friendId => friendId !== id);
        await API.patch(`/users/${u.id}`, { friends: updatedFriends });
      }
    }));

    await API.delete(`/users/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete user with ID ${id}: ${error.message}`);
  }
};