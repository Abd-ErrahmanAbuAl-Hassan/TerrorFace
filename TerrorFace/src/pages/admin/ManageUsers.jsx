// /src/pages/admin/ManageUsers.jsx

import React, { useEffect, useState, useContext } from 'react';
import { 
  getAllUsers, 
  deleteUser, 
  promoteUser, 
  RevokePromotion,
  createUser 
} from '../../services/userService';
import { AuthContext } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faUserShield, 
  faCrown, 
  faTrash, 
  faArrowUp, 
  faArrowDown,
  faSearch,
  faPlus,
  faLock,
} from '@fortawesome/free-solid-svg-icons';

export default function ManageUsers() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random().toString(36).substring(2, 10)}`
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(u =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (id) => {
    try {
      await promoteUser(id);
      setUsers(prev => prev.map(u => 
        u.id === id ? { ...u, role: 'admin' } : u
      ));
    } catch (error) {
      console.error("Promotion failed:", error);
      alert(error.message);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await RevokePromotion(id);
      setUsers(prev => prev.map(u => 
        u.id === id ? { ...u, role: 'user' } : u
      ));
    } catch (error) {
      console.error("Revoke failed:", error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user and all their content?")) {
      try {
        await deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        console.error("Deletion failed:", error);
        alert(error.message);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm();
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        const createdUser = await createUser(newUser);
        setUsers(prev => [...prev, createdUser]);
        setNewUser({
          username: '',
          email: '',
          password: '',
          role: 'user',
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random().toString(36).substring(2, 10)}`
        });
        setShowCreateForm(false);
        setErrors({});
      } catch (error) {
        setErrors({ form: error.message });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateUserForm = () => {
    const errors = {};
    if (!newUser.username.trim()) errors.username = 'Username is required';
    if (!newUser.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      errors.email = 'Email is invalid';
    }
    if (!newUser.password) errors.password = 'Password is required';
    else if (newUser.password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin': return <FontAwesomeIcon icon={faCrown} className="superadmin" />;
      case 'admin': return <FontAwesomeIcon icon={faUserShield} className="admin" />;
      default: return <FontAwesomeIcon icon={faUser} className="user" />;
    }
  };

  return (
    <div className="manage-users">
      <div className="header-actions">
        <h2>
          <FontAwesomeIcon icon={faUserShield} /> Manage Users
        </h2>
        {currentUser.role === 'superadmin' || currentUser.role === 'admin' ? (
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-user-btn"
          >
            <FontAwesomeIcon icon={faPlus} /> Create User
          </button>
        ) : null}
      </div>

      {showCreateForm && (
        <div className="create-user-form">
          <h3>
            <FontAwesomeIcon icon={faUser} /> Create New User
          </h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            
            {currentUser.role === 'superadmin' && (
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            
            {errors.form && <div className="form-error">{errors.form}</div>}
            
            <div className="form-actions">
              <button type="button" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                <FontAwesomeIcon icon={faLock} /> Create User
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className={u.id === currentUser.id ? 'current-user' : ''}>
                  <td>
                    <div className="user-info">
                      <img src={u.avatar} alt={u.username} className="user-avatar" />
                      <span>{u.username}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <div className="role-cell">
                      {getRoleIcon(u.role)}
                      <span>{u.role}</span>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      {currentUser.role === 'superadmin' && u.role !== 'superadmin' && (
                        <>
                          {u.role !== 'admin' ? (
                            <button 
                              onClick={() => handlePromote(u.id)}
                              className="promote"
                              title="Promote to admin"
                            >
                              <FontAwesomeIcon icon={faArrowUp} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleRevoke(u.id)}
                              className="revoke"
                              title="Revoke admin"
                            >
                              <FontAwesomeIcon icon={faArrowDown} />
                            </button>
                          )}
                        </>
                      )}

                      {currentUser.role === 'admin' && u.role === 'user' && (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="delete"
                          title="Delete user"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}

                      {currentUser.role === 'superadmin' && u.id !== currentUser.id && (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="delete"
                          title="Delete user"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
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