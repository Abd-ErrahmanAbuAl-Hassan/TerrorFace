// /src/pages/user/Profile.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getUserById } from '../../services/userService';
import FriendsList from '../../components/layout/FriendsList';
import UserPost from '../../components/post/UserPost'; 
import '../../styles/profile.css'; 

export default function Profile() {
  const { user: currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !id || id === currentUser?.id.toString();

  useEffect(() => {
    if (isOwnProfile) {
      setProfileUser(currentUser);
    } else {
      getUserById(id).then(user => {
        setProfileUser(user);
      });
      
    }
    setLoading(false);
  }, [id, currentUser]);


  if (!profileUser) return (
    <div className="loading dragon-text">
      <div className="dragon-pulse">Loading profile...</div>
    </div>
  );

  return (
    <div className="profile-container dragon-bg">
      <div className="profile-sidebar">
        <div className="profile-card dragon-pulse">
          <img 
            src={profileUser.avatar} 
            alt="avatar" 
            className="profile-avatar" 
          />
          
          <div className="profile-bio">
            <h2 className="profile-username dragon-text">{profileUser.username}</h2>
            <div><span>Email:</span> {profileUser.email || 'No email provided'}</div>
          </div>
        </div>  

        <FriendsList />
      </div>

      <div className="posts-container">
        {loading ? (
          <div className="loading dragon-text">
            <div className="dragon-pulse">Loading posts...</div>
          </div>
          ) : <div className="user-posts"> <UserPost /></div>
        }
      </div>
    </div>
  );
}