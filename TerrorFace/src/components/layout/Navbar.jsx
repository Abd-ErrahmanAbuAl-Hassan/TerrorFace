// /src/components/layout/Navbar.jsx

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useFriendRequests } from '../../contexts/FriendRequestContext';
import { getEnrichedFriendRequests, acceptRequest, rejectRequest } from '../../services/friendService';
import logo from '../../assets/logo.png';
import { FaHome, FaUserAlt, FaUserFriends, FaBell, FaTimes, FaCheck,FaSignOutAlt } from 'react-icons/fa';
import { getUserById } from '../../services/userService';


export default function Navbar() {
  const { user ,logout,updateUser } = useContext(AuthContext);
  const { requests, updateRequests, removeRequest } = useFriendRequests();
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  useEffect(() => {
    if (user) {
      fetchFriendRequests();
    }
  }, [user]);

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      const data = await getEnrichedFriendRequests(user.id);
      updateRequests(data);
    } catch (error) {
      console.error('Failed to fetch friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (showNotifications) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  const handleAccept = async (requestId) => {
    try {
      await acceptRequest(requestId);
      const _user = await getUserById(user.id)
      updateUser({ friends: [..._user.friends] })
      removeRequest(requestId);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId);
      removeRequest(requestId);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  return (
    <nav className="navbar dragon-bg">
      <div className="nav-left">
        <img src={logo} alt="logo" className="logo dragon-pulse" />
      </div>
      
      {user && (
        <div className="nav-right">
          {user.role === 'user' && (
            <>
              <Link to="/" className="nav-link"><FaHome /> Home</Link>
              <Link to="/profile" className="nav-link"><FaUserAlt /> Profile</Link>
              <Link to="/users" className="nav-link"><FaUserFriends /> Users</Link>
              <div className="notification-container">
                <button 
                  className="notification-btn nav-link"
                  onClick={toggleNotifications}
                >
                  <FaBell />
                  {requests.length > 0 && (
                    <span className="notification-badge">{requests.length}</span>
                  )}
                </button>
                {showNotifications && (
                  <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="notification-header">
                      <h3>Friend Requests</h3>
                      <span>{requests.length} pending</span>
                    </div>
                    {loading ? (
                      <div className="notification-loading">Loading...</div>
                    ) : requests.length === 0 ? (
                      <div className="notification-empty">
                        No pending requests
                      </div>
                    ) : (
                      <ul className="notification-list">
                        {requests.map(request => (
                          <li key={request.id} className="notification-item">
                            <div className="notification-sender">
                              <img 
                                src={request.senderAvatar} 
                                alt={request.senderName} 
                                className="notification-avatar"
                                onError={(e) => {
                                  e.target.src = '/default-avatar.png';
                                }}
                              />
                              <span>{request.senderName}</span>
                            </div>
                            <div className="notification-actions">
                              <button 
                                onClick={() => handleAccept(request.id)}
                                className="accept-btn"
                              >
                                <FaCheck /> Accept
                              </button>
                              <button 
                                onClick={() => handleReject(request.id)}
                                className="reject-btn"
                              >
                                <FaTimes /> Reject
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          {user.role !== 'user' && (
            <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
          )}
         

          <Link to="/profile">
            <img 
              src={user.avatar} 
              alt="avatar" 
              className="avatar"
              title={user.username}
            />
          </Link>
           <div className="logout-btn">
                 <button onClick={handleLogout}><FaSignOutAlt/>Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}