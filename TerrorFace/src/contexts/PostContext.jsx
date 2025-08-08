// /src/contexts/PostContext.jsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getPosts } from '../services/postService';

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPosts();
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePostInContext = (postId, updates) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        if (updates.comments) {
          return {
            ...post,
            comments: Array.isArray(updates.comments) ? updates.comments : []
          };
        }
        return { ...post, ...updates };
      }
      return post;
    }));
  };

  const deletePostFromContext = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  return (
    <PostContext.Provider value={{ 
      posts, 
      loading,
      error,
      fetchPosts: refreshPosts,
      addPost, 
      updatePost: updatePostInContext, 
      deletePost: deletePostFromContext 
    }}>
      {children}
    </PostContext.Provider>
  );
}