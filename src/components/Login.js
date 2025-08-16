import React, { useState } from 'react';
import api, { setAuthToken } from '../api';
import { TextField, Button } from '@mui/material';
import Register from './Register';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      onLogin();
    } catch (err) {
        console.error(err.response?.data || err.message);
 
      alert(err.response?.data);
    }
  };

  if (showRegister) return <Register onBack={() => setShowRegister(false)} />;

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Login</h2>
      <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth type="password" label="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginTop: 10 }} />
      <Button variant="contained" fullWidth onClick={handleLogin} style={{ marginTop: 10 }}>Login</Button>
      <Button fullWidth onClick={() => setShowRegister(true)} style={{ marginTop: 10 }}>Register</Button>
    </div>
  );
}
