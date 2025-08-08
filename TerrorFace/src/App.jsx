// /src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Home from './pages/user/Home';
import Profile from './pages/user/Profile';
import Users from './pages/user/Users';

import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';

import Dashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePosts from './pages/admin/ManagePosts';

import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Navbar from './components/layout/Navbar';

import { PostProvider } from './contexts/PostContext';
import { FriendRequestProvider } from './contexts/FriendRequestContext';


export default function App() {
  return (
    <>
    
      <PostProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />     

          
          <Route path="/" element={
              <ProtectedRoute>
                <FriendRequestProvider>
                  <UserLayout />
                </FriendRequestProvider>
              </ProtectedRoute>
            }>

            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="users" element={<Users />} />
          </Route>

          <Route path="/admin" element={<FriendRequestProvider> <Navbar /> <AdminLayout /> </FriendRequestProvider>}>
            <Route path="dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
            <Route path="posts" element={<AdminRoute><ManagePosts /></AdminRoute>} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PostProvider>
    </>
  );
}
