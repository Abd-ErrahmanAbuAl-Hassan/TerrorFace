// /src/services/commentService.js

import API from './api';

export const getCommentsByPost = async (postId) => {
  try {
    const res = await API.get(`/comments?postId=${postId}&_expand=user&_sort=createdAt&_order=desc`);
    return res.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (comment) => {
  try {
    const res = await API.post('/comments', {
      ...comment,
      content: comment.content.trim()
    });
    return res.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const createComment = async (comment) => {
  try {
    const res = await API.post('/comments', {
      ...comment,
      content: comment.content.trim(),
      createdAt: new Date().toISOString()
    });
    return res.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateComment = async (id, updates) => {
  try {
    const res = await API.patch(`/comments/${id}`, {
      ...updates,
      content: updates.content.trim(),
      updatedAt: new Date().toISOString()
    });
    return res.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (id) => {
  try {
    await API.delete(`/comments/${id}`);
    return id; 
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};