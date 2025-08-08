// /src/pages/auth/Login.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginService } from '../../services/auth';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService(email, password);
      if (!user) throw new Error('Invalid credentials');
      login(user);

      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Email or password is incorrect');
      console.log(err);
    }
  };

  return (
    <div className="container auth-container">
      <span className="dragon-decoration decoration-1">🐉</span>
      <span className="dragon-decoration decoration-2">🐲</span>
      
      <h2 className="auth-title">Welcome to TerrorFace</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Your Dragon Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Your Dragon Code"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit">Log In</button>
        {error && <p className="error">{error}</p>}
        <p>
          Don't have an account? <Link to="/register">Create Egg</Link>
        </p>
      </form>
    </div>
  );
}
