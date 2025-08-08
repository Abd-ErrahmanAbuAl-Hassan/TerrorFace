// /src/components/post/PostForm.jsx

import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { PostContext } from '../../contexts/PostContext';
import { createPost } from '../../services/postService';

export default function PostForm() {
  const { user } = useContext(AuthContext);
  const { addPost } = useContext(PostContext);
  const [content, setContent] = useState('');
  
  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost = {
      content,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      likes: [],
      createdAt: new Date().toISOString(),
      share: []
    };

    try {
      const createdPost = await createPost(newPost);
      addPost(createdPost); 
      setContent('');
    } catch (err) {
      console.error('Post failed', err);
    }
  };

  return (
    <form onSubmit={handlePost} className="post-form">
      <div className="post-input-container">
        <img src={user.avatar} alt="avatar" className="avatar" />
        <div className="dragon-textarea-container ">
          <textarea
            className="dragon-textarea "
            placeholder={`What's on your mind, ${user.username}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
          />
        </div>
      </div>
      <div className="post-actions">
        <button type="submit" disabled={!content.trim()}>
          Post
        </button>
      </div>
    </form>
  );
}