// /src/components/post/PostList.jsx

import React, { useContext ,useState} from 'react';
import PostComments from './PostComments';
import EditPost from './EditPost';
import { PostContext } from '../../contexts/PostContext';
import { AuthContext } from '../../contexts/AuthContext';
import { likePost, sharePost, deletePost } from '../../services/postService';
import { timeAgo } from '../../utils/formatTime';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEdit, FaTrash } from 'react-icons/fa';

export default function PostList() {
  const { user } = useContext(AuthContext);
  const { posts, updatePost: updatePostInContext, deletePost: deletePostFromContext } = useContext(PostContext);
  const [editingPost, setEditingPost] = useState(null);

  const handleLike = async (post) => {
    const currentLikes = Array.isArray(post.likes) ? post.likes : [];
    const alreadyLiked = currentLikes.includes(user.id);
    const updatedLikes = alreadyLiked
      ? currentLikes.filter((id) => id !== user.id)
      : [...currentLikes, user.id];

    try {
      await likePost(post.id, updatedLikes );
      updatePostInContext(post.id, { likes: updatedLikes });
    } catch (err) {
      console.error('Like failed', err);
    }
  };


  const handleShare = async (post) => {
    const currentShares = Array.isArray(post.share) ? post.share : [];
    const updatedShares = [...currentShares, user.id];
    
    try {
      await sharePost(post.id,  updatedShares );
      updatePostInContext(post.id, { share: updatedShares });
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        deletePostFromContext(postId);
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  return (
   
    <div className="post-list">
      {posts.map((post) => {
        const postLikes = Array.isArray(post.likes) ? post.likes : [];
        const postComments = Array.isArray(post.comments) ? post.comments : [];
        
        return (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <img src={post.avatar} alt="avatar" className="avatar-sm" />
              <div className="post-user-info">
                <strong>{post.username}</strong>
                <span className="post-time">{timeAgo(post.createdAt)}</span>
              </div>
              {post.userId === user.id && (
                <div className="post-actions">
                  <button onClick={() => setEditingPost(post)} title="Edit post">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(post.id)} title="Delete post">
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            <p className="post-content">{post.content}</p>

            <div className="post-stats">
              <span><FaHeart /> {postLikes.length} Likes</span>
              <span><FaComment /> {postComments.length} Comments</span>
              <span><FaShare /> {Array.isArray(post.share) ? post.share.length : 0} Shares</span>
            </div>

            <div className="post-actions-buttons">
              <button 
                onClick={() => handleLike(post)} 
                className={`like-btn ${postLikes.includes(user.id) ? 'liked' : ''}`}
              >
                {postLikes.includes(user.id) ? <FaHeart /> : <FaRegHeart />}
                {postLikes.includes(user.id) ? ' Unlike' : ' Like'}
              </button>

                <PostComments post={{ ...post, comments: Array.isArray(post.comments) ? post.comments : []}} />

              <button onClick={() => handleShare(post)} className="share-btn">
                <FaShare /> Share
              </button>
            </div>
          </div>
        );
      })}

      {editingPost && (
        <EditPost 
          post={editingPost} 
          onClose={() => setEditingPost(null)}
          onUpdate={(updatedPost) => {
            updatePostInContext(updatedPost.id, updatedPost);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}