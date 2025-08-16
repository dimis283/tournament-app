import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TournamentList from './components/TournamentList';
import { setAuthToken } from './api';
import { Button } from '@mui/material';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setLoggedIn(false);
  };

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <div style={{ padding: 20 }}>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
      <TournamentList />
    </div>
  );
}

export default App;
