// /src/services/postService.js

import API from './api';

export const getAllPosts = async () => {
  const res = await API.get('/posts?_sort=id&_order=desc');
  return res.data;
};

export const getPostsByUser = async (userId) => {
  const res = await API.get(`/posts?userId=${userId}&_sort=id&_order=desc`);
  return res.data;
};

export const createPost = async (post) => {
  const res = await API.post('/posts', post);
  return res.data;
};

export const deletePost = async (postId) => {
  await API.delete(`/posts/${postId}`);
};

export const updatePost = async (postId, updatedPost) => {
  const res = await API.patch(`/posts/${postId}`, updatedPost);
  return res.data;
};

export const getPosts = async () => {
  return API.get(`/posts?_sort=id&_order=desc&_embed=comments`);
};


export const likePost = async (id, likes) => {
  return API.patch(`/posts/${id}`, { likes: likes });
};

export const sharePost = async (postId, shares) => {
  return API.patch(`/posts/${postId}`, { share: shares });
};