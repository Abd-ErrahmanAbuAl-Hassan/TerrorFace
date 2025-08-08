// /src/components/layout/UserProfile.jsx

import React, { useState, useContext, useEffect} from 'react'
import { useNavigate ,Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'
import { PostContext } from '../../contexts/PostContext';
import { FaSignOutAlt } from 'react-icons/fa';


export default function UserProfile() {
    const { user , logout } = useContext(AuthContext);
    const { posts } = useContext(PostContext);
    const [postsCount, setPostsCount] = useState(0);
    const [friendsCount, setFriendsCount] = useState(0);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        if (user) {
            const userPosts = posts.filter(post => post.userId === user.id);
            setPostsCount(userPosts.length);
            setFriendsCount(user.friends?.length || 0);
        }
    }, [user, posts]);

    return (
        <div className='user-profile-container'>
            <div className="home-profile-card">
                <h2 className='user-profile-title'>User Profile</h2>
                <div className='user-profile-content'>

                    <Link to="/profile"><img src={user?.avatar} alt="avatar" className="profile-avatar" /> </Link>
                    
                    <div className="profile-bio">
                        <Link to="/profile"><h2 className="profile-username">{user?.username}</h2></Link>
                        <div><span>Email:</span> {user?.email || 'No email provided'}</div>
                    </div>
                    
                    <div className="profile-info">
                        <Link to="/profile"><div><span>Friends:</span> {friendsCount}</div></Link>
                        <Link to="/profile"><div><span>Posts:</span> {postsCount}</div></Link>
                    </div>
                </div>
            </div>

            <div className="logout-btn">
                 <button onClick={handleLogout}><FaSignOutAlt/>Logout</button>
            </div>

        </div>
    )
}