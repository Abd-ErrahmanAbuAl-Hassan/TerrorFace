// /src/pages/user/Users.jsx

import React from 'react';
import NewRequests from '../../components/layout/NewRequests';
import PendingRequests from '../../components/layout/PendingRequests';
import '../../styles/users.css'; 

export default function Users() {
  const [view, setView] = React.useState('new');

  return (
    <div className="users-page">
      <div className="view-toggle">
        <button 
          onClick={() => setView('new')} 
          className={`toggle-btn ${view === 'new' ? 'active' : ''}`}
        >
          Find New Friends
        </button>
        <button 
          onClick={() => setView('pending')} 
          className={`toggle-btn ${view === 'pending' ? 'active' : ''}`}
        >
          Pending Requests
        </button>
      </div>
      <div className="view-content">
        {view === 'new' ? <NewRequests key="new" /> : <PendingRequests key="pending" />}
      </div>
    </div>
  );
}