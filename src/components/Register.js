// src/components/Register.js
import React, { useState } from 'react';

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (localStorage.getItem(username)) {
      alert('User already exists');
    } else {
      localStorage.setItem(username, JSON.stringify({ password }));
      alert('Registration successful!');
      onRegister();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
