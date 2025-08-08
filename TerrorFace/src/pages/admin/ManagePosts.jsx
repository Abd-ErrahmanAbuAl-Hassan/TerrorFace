// /src/pages/admin/ManagePosts.jsx

import React, { useEffect, useState } from 'react';
import { getAllPosts, deletePost } from '../../services/postService';
import { getAllUsers } from '../../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faScroll, 
  faTrash, 
  faSearch,
  faUser,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, usersData] = await Promise.all([
          getAllPosts(),
          getAllUsers()
        ]);
        setPosts(postsData);
        setFilteredPosts(postsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = posts.filter(post => {
      const user = users.find(u => u.id === post.userId);
      const username = user?.username || 'Unknown';
      return (
        username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredPosts(results);
  }, [searchTerm, posts, users]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        setPosts(prev => prev.filter(post => post.id !== id));
      } catch (error) {
        console.error("Deletion failed:", error);
      }
    }
  };

  const getAuthor = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.username || 'Unknown';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="manage-posts">
      <h2>
        <FontAwesomeIcon icon={faScroll} /> Manage Posts
      </h2>
      
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Content</th>
                <th>
                  <FontAwesomeIcon icon={faUser} /> Author
                </th>
                <th>
                  <FontAwesomeIcon icon={faCalendarAlt} /> Date
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id}>
                  <td className="content-cell">
                    <div className="post-content">
                      {post.content.length > 100 
                        ? `${post.content.substring(0, 100)}...` 
                        : post.content}
                    </div>
                  </td>
                  <td>{getAuthor(post.userId)}</td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="delete"
                      title="Delete post"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}