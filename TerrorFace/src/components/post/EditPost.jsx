// /src/components/post/EditPost.jsx

import React, { useState } from 'react';
import Modal from 'react-modal';
import { updatePost } from '../../services/postService';
import {  FaEdit } from 'react-icons/fa';

Modal.setAppElement('#root');

export default function EditPost({ post, onClose, onUpdate }) {
  const [content, setContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const updatedPost = await updatePost(post.id, { content });
      onUpdate(updatedPost);
      onClose();
    } catch (err) {
      console.error('Failed to update post', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onRequestClose={onClose}
      className="popup-modal"
      overlayClassName="popup-overlay"
      closeTimeoutMS={300}
    >
      <div className="modal-header">
        <h3><FaEdit /> Edit Post</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
          <div className="dragon-textarea-container">
            <textarea
              className="dragon-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              autoFocus
            />
          </div>
        <div className="modal-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-btn"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}