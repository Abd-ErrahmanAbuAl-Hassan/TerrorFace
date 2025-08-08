// /src/components/post/UserPost.jsx

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { PostContext } from '../../contexts/PostContext';
import { timeAgo } from '../../utils/formatTime';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEdit, FaTrash } from 'react-icons/fa';
import { likePost, sharePost, deletePost } from '../../services/postService';
import PostComments from './PostComments';
import EditPost from './EditPost';


export default function UserPost() {
    const { user } = useContext(AuthContext);
    const { posts, updatePost: updatePostInContext, deletePost: deletePostFromContext } = useContext(PostContext);
    const [userPosts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    
    useEffect(() => {
        if (user) {
            const userPosts = posts.filter(post => post.userId === user.id);
            setPosts(userPosts);
        }
    }, [user, posts]);



    const handleLike = async (post) => {
        const currentLikes = Array.isArray(post.likes) ? post.likes : [];
        const alreadyLiked = currentLikes.includes(user.id);
        const updatedLikes = alreadyLiked
          ? currentLikes.filter((id) => id !== user.id)
          : [...currentLikes, user.id];
    
        try {
          await likePost(post.id,  updatedLikes );
          updatePostInContext(post.id, { likes: updatedLikes });
        } catch (err) {
          console.error('Like failed', err);
        }
    };

    const handleShare = async (post) => {
        const currentShares = Array.isArray(post.share) ? post.share : [];
        const updatedShares = [...currentShares, user.id];
        
        try {
            await sharePost(post.id, updatedShares );
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
            {userPosts.length === 0 && (
                <div className="no-posts dragon-text">
                    <div className="dragon-pulse">No posts found. Start sharing your thoughts!</div>
                </div>
            )}
            {userPosts.map((post) => {
                const postLikes = Array.isArray(post.likes) ? post.likes : [];
                const postComments = Array.isArray(post.comments) ? post.comments : [];
                
                return (
                    <div key={post.id} className="post-card dragon-pulse">
                        <div className="post-header">
                            <img src={post.avatar} alt="avatar" className="avatar-sm" />
                            <div className="post-user-info">
                                <strong className="dragon-text">{post.username}</strong>
                                <span className="post-time">{timeAgo(post.createdAt)}</span>
                            </div>
                            {post.userId === user.id && (
                                <div className="post-actions">
                                    <button 
                                        onClick={() => setEditingPost(post)} 
                                        title="Edit post"
                                        className="dragon-btn-secondary"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(post.id)} 
                                        title="Delete post"
                                        className="dragon-btn-secondary"
                                    >
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
                                {postLikes.includes(user.id) ? ' Liked' : ' Like'}
                            </button>

                            <PostComments 
                                post={{ ...post, comments: Array.isArray(post.comments) ? post.comments : []}} 
                            />

                            <button 
                                onClick={() => handleShare(post)} 
                                className="share-btn dragon-btn-secondary"
                            >
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