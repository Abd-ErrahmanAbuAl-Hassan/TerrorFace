// /src/pages/auth/Register.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../../services/userService';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/auth.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`;

    const userData = {
      username,
      email,
      password,
      role: 'user',
      friends: [],
      avatar,
    };

    try {
      const newUser = await createUser(userData);
      login(newUser);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to register. Try again.');
      console.error(err);
    }
  };

  return (
    <div className="container auth-container">
      <span className="dragon-decoration decoration-1">🐲</span>
      <span className="dragon-decoration decoration-2">🐉</span>
      
      <h2 className="auth-title">Join TerrorFace</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Dragon Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={validationErrors.username ? 'error-input' : ''}
          />
          {validationErrors.username && (
            <span className="error-message">{validationErrors.username}</span>
          )}
        </div>
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Dragon Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            className={validationErrors.email ? 'error-input' : ''}
          />
          {validationErrors.email && (
            <span className="error-message">{validationErrors.email}</span>
          )}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Dragon Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={validationErrors.password ? 'error-input' : ''}
          />
          {validationErrors.password && (
            <span className="error-message">{validationErrors.password}</span>
          )}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Dragon Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={validationErrors.confirmPassword ? 'error-input' : ''}
          />
          {validationErrors.confirmPassword && (
            <span className="error-message">{validationErrors.confirmPassword}</span>
          )}
        </div>
        
        <button type="submit">new dragonegg</button>
        {error && <p className="error">{error}</p>}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}