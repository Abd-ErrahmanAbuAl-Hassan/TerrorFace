// /src/components/common/AdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function AdminRoute({ children }) {
const { user, loading } = useContext(AuthContext);

if (loading) {
  return <div>Loading...</div>;
}

if (!user) {
  return <Navigate to="/login" replace />;
}

if (user.role !== 'admin' && user.role !== 'superadmin') {
  return <Navigate to="/" replace />;
}

return children;

}
