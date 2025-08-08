// /src/components/post/PostComments.jsx

import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import { updateComment, createComment, deleteComment } from '../../services/commentService';
import { timeAgo } from '../../utils/formatTime';
import { AuthContext } from '../../contexts/AuthContext';
import { PostContext } from '../../contexts/PostContext';
import { FaComment, FaEdit, FaTrash, FaTimes, FaPaperPlane } from 'react-icons/fa';

Modal.setAppElement('#root');

export default function PostComments({ post }) {
  const { user } = useContext(AuthContext);
  const { updatePost } = useContext(PostContext);
  const [isOpen, setIsOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setComments(Array.isArray(post.comments) ? post.comments : []);
  }, [post.comments]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setEditingComment(null);
    setCommentContent('');
    setError(null);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    setDeletingId(commentId);
    setError(null);
    
    try {
      setComments(prev => prev.filter(c => c.id !== commentId));
      
      await deleteComment(commentId);
      
      updatePost(post.id, {
        comments: comments.filter(c => c.id !== commentId)
      });
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('Failed to delete comment. Please try again.');
      setComments(post.comments || []);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const newComment = {
      postId: post.id,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content: commentContent,
      createdAt: new Date().toISOString()
    };
    const tempId = `temp-${Date.now()}`;
    try {
      
      setComments(prev => [{
        ...newComment,
        id: tempId
      }, ...prev]);

      const createdComment = await createComment(newComment);
      
      setComments(prev => [
        createdComment,
        ...prev.filter(c => c.id !== tempId)
      ]);
      
      updatePost(post.id, {
        comments: [createdComment, ...comments]
      });
      
      setCommentContent('');
    } catch (err) {
      console.error('Failed to create comment:', err);
      setError(`Failed to post comment: ${err.response?.data?.message || err.message}`);
      setComments(prev => prev.filter(c => c.id !== tempId));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingComment?.content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      setComments(prev => prev.map(comment => 
        comment.id === editingComment.id ? 
        { ...comment, content: editingComment.content } : 
        comment
      ));

      const updatedComment = await updateComment(editingComment.id, {
        content: editingComment.content
      });
      
      updatePost(post.id, {
        comments: comments.map(comment => 
          comment.id === updatedComment.id ? updatedComment : comment
        )
      });
      
      setEditingComment(null);
    } catch (err) {
      console.error('Failed to update comment:', err);
      setError(`Failed to update comment: ${err.response?.data?.message || err.message}`);
      setComments(post.comments || []);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className="comments-btn" onClick={toggleModal}>
        <FaComment /> Comments ({comments.length})
      </button>
      
      <Modal 
        isOpen={isOpen} 
        onRequestClose={toggleModal}
        className="popup-modal"
        overlayClassName="popup-overlay"
        closeTimeoutMS={300}
      >
        <div className="modal-header">
          <h3><FaComment /> Comments ({comments.length})</h3>
          <button className="close-btn" onClick={toggleModal}><FaTimes /></button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="post-preview">
          <div className="post-header">
            <img src={post.avatar} alt="avatar" className="avatar" />
            <div>
              <strong>{post.username}</strong>
              <p>{timeAgo(post.createdAt)}</p>
            </div>
          </div>
          <p>{post.content}</p>
        </div>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="dragon-textarea-container">
            <textarea
              className="dragon-textarea"
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <button 
            type="submit" 
            disabled={!commentContent.trim() || isSubmitting}
            className={isSubmitting ? 'loading' : ''}
          >
            {isSubmitting ? 'Posting...' : <><FaPaperPlane /> Post</>}
          </button>
        </form>

        <div className="comments-list">
          {comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`comment ${comment.userId === post.userId ? 'op-comment' : ''}`}
            >
              <img 
                src={comment.avatar} 
                alt="avatar" 
                className="comment-avatar"
                onError={(e) => {
                  e.target.src = 'default-avatar.png';
                }}
              />
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-username">
                    {comment.username}
                    {comment.userId === post.userId && (
                      <span className="op-badge">OP</span>
                    )}
                  </span>
                  <span className="comment-time">
                    {timeAgo(comment.createdAt)}
                  </span>
                  {(comment.userId === user.id || user.id === post.userId) && (
                    <div className="comment-actions">
                      <button 
                        onClick={() => setEditingComment(comment)}
                        className="comment-action-btn"
                        disabled={isSubmitting}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="comment-action-btn"
                        disabled={isSubmitting || deletingId === comment.id}
                      >
                        {deletingId === comment.id ? 'Deleting...' : <FaTrash />}
                      </button>
                    </div>
                  )}
                </div>
                
                {editingComment?.id === comment.id ? (
                  <form onSubmit={handleEditSubmit} className="comment-edit-form">
                    <textarea
                      className="dragon-textarea"
                      value={editingComment.content}
                      onChange={(e) => setEditingComment({
                        ...editingComment,
                        content: e.target.value
                      })}
                      disabled={isSubmitting}
                      autoFocus
                    />
                    <div className="comment-edit-actions">
                      <button 
                        type="button" 
                        className="comment-action-btn"
                        onClick={() => setEditingComment(null)}
                        disabled={isSubmitting}
                      >
                        <FaTimes /> Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="comment-action-btn primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="comment-content">{comment.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}