// /src/pages/admin/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faUserShield, faScroll, faDragon} from '@fortawesome/free-solid-svg-icons';
import { getAllUsers} from '../../services/userService';
import {  getAllPosts } from '../../services/postService';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, admins: 0, totalPosts: 0, activeToday: 0, dragons: 3 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, posts] = await Promise.all([
        getAllUsers(),
        getAllPosts()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const activeToday = users.filter(u => 
        u.lastLogin && u.lastLogin.includes(today)
      ).length;

      setStats({
        totalUsers: users.length,
        admins: users.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
        totalPosts: posts.length,
        activeToday,
        dragons: 3 
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        <FontAwesomeIcon icon={faDragon} /> Dragon's Lair Dashboard
      </h2>
      
      <div className="stats-grid">
        <StatCard 
          icon={faUser} 
          title="Total Users" 
          value={stats.totalUsers} 
          color="#f05454"
        />
        <StatCard 
          icon={faUserShield} 
          title="Admins" 
          value={stats.admins} 
          color="#4ecca3"
        />
        <StatCard 
          icon={faScroll} 
          title="Total Posts" 
          value={stats.totalPosts} 
          color="#e94560"
        />
      </div>

    </div>
  );
}

const StatCard = ({ icon, title, value, color }) => (
  <div className="stat-card" style={{ borderBottom: `4px solid ${color}` }}>
    <div className="stat-icon" style={{ color }}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <div className="stat-content">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  </div>
);