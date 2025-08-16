import React, { useEffect, useState } from 'react';
import api from '../api';
import { 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Pagination,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import ResultList from './ResultList';

export default function TournamentList() {
  const [tournaments, setTournaments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => { 
    fetchTournaments(currentPage); 
  }, [currentPage, perPage]);

  const fetchTournaments = async (page = 1) => {
  setLoading(true);
  try {
    const res = await api.get(`/tournaments?page=${page}&per_page=${perPage}`);
    
    // Debugging - δες τι επιστρέφει
    console.log('API Response:', res.data);
    console.log('Type of res.data:', typeof res.data);
    console.log('Is array?', Array.isArray(res.data));
    
    // Έλεγξε αν είναι pagination response ή απλό array
    if (res.data.data && Array.isArray(res.data.data)) {
      // Laravel pagination
      setTournaments(res.data.data);
      setCurrentPage(res.data.current_page);
      setTotalPages(res.data.last_page);
      setTotalCount(res.data.total);
    } else if (Array.isArray(res.data)) {
      // Απλό array (χωρίς pagination)
      setTournaments(res.data);
      setTotalPages(1);
      setCurrentPage(1);
      setTotalCount(res.data.length);
    } else {
      console.error('Unexpected response format:', res.data);
      setTournaments([]);
    }
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    setTournaments([]); // Σημαντικό: set empty array σε error
  } finally {
    setLoading(false);
  }
};

  const addTournament = async () => {
    if (!name.trim()) return;
    
    try {
      await api.post('/tournaments', { name, description });
      setName(''); 
      setDescription('');
      // Επιστροφή στη πρώτη σελίδα μετά την προσθήκη
      setCurrentPage(1);
      fetchTournaments(1);
    } catch (error) {
      console.error('Error adding tournament:', error);
    }
  };

  const deleteTournament = async (id) => {
    try {
      await api.delete(`/tournaments/${id}`);
      
      // Αν διαγράψουμε το τελευταίο στοιχείο της σελίδας, πήγαινε στην προηγούμενη
      if (tournaments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
        fetchTournaments(currentPage - 1);
      } else {
        fetchTournaments(currentPage);
      }
    } catch (error) {
      console.error('Error deleting tournament:', error);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Επιστροφή στη πρώτη σελίδα
  };

  return (
    <div>
      <h2>Tournaments</h2>
      
      {/* Add Tournament Form */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField 
          label="Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          size="small"
        />
        <TextField 
          label="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          size="small"
        />
        <Button 
          onClick={addTournament} 
          variant="contained"
          disabled={!name.trim() || loading}
        >
          Add Tournament
        </Button>
      </Box>

      {/* Pagination Info */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {tournaments.length} of {totalCount} tournaments
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2">Items per page:</Typography>
          {[5, 10, 20, 50].map(size => (
            <Button
              key={size}
              size="small"
              variant={perPage === size ? 'contained' : 'outlined'}
              onClick={() => handlePerPageChange(size)}
            >
              {size}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tournament List */}
      <List>
        {tournaments.map(t => (
          <ListItem key={t.id} divider>
            <ListItemText primary={t.name} secondary={t.description} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                onClick={() => setSelectedTournament(t)}
                size="small"
              >
                Results
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => deleteTournament(t.id)}
                size="small"
                disabled={loading}
              >
                Delete
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Results Dialog */}
      <Dialog 
        open={!!selectedTournament} 
        onClose={() => setSelectedTournament(null)} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>Results for {selectedTournament?.name}</DialogTitle>
        <DialogContent>
          {selectedTournament && <ResultList tournamentId={selectedTournament.id} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTournament(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}