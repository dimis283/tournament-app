import React, { useState } from 'react';
import api from '../api';
import { TextField, Button } from '@mui/material';

export default function Register({ onBack }) {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [passwordConfirm,setPasswordConfirm] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/register', {
        name, email, password, password_confirmation: passwordConfirm
      });
      alert('Registered successfully!');
      onBack();
    } catch(err){
      alert('Error registering user');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Register</h2>
      <TextField fullWidth label="Name" value={name} onChange={e=>setName(e.target.value)} />
      <TextField fullWidth label="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{ marginTop: 10 }} />
      <TextField fullWidth type="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{ marginTop: 10 }} />
      <TextField fullWidth type="password" label="Confirm Password" value={passwordConfirm} onChange={e=>setPasswordConfirm(e.target.value)} style={{ marginTop: 10 }} />
      <Button variant="contained" fullWidth onClick={handleRegister} style={{ marginTop: 10 }}>Register</Button>
      <Button fullWidth onClick={onBack} style={{ marginTop: 10 }}>Back to Login</Button>
    </div>
  );
}
