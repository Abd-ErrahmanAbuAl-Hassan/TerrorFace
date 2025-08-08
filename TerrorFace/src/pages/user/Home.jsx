// /src/pages/user/Home.jsx

import React, { useContext } from 'react';
import PostForm from '../../components/post/PostForm';
import PostList from '../../components/post/PostList';
import { PostContext } from '../../contexts/PostContext';
import UserProfile from '../../components/layout/UserProfile';
import '../../styles/home.css';

export default function Home() {
  const { loading } = useContext(PostContext);

  return (
     <div className="home-container">
      <UserProfile />
      <div className="news">
        <PostForm />
        {loading ? (
          <p className="loading-text">🔥 Loading posts...</p>
        ) : (
          <PostList />
        )}
      </div>
    </div>
  );
}