import React, { useEffect, useState } from 'react';
import api from '../api';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function ResultList({ tournamentId }) {
  const [results, setResults] = useState([]);
  const [opponent, setOpponent] = useState('');
  const [rating, setRating] = useState('');
  const [result, setResult] = useState('win');
  const [description, setDescription] = useState('');

  useEffect(() => { fetchResults(); }, [tournamentId]);

  const fetchResults = async () => {
    const res = await api.get('/results');
    setResults(res.data.filter(r => r.tournament_id === tournamentId));
  };

  const addResult = async () => {
    await api.post('/results', { tournament_id: tournamentId, opponent, rating, result, description });
    setOpponent(''); setRating(''); setResult('win'); setDescription('');
    fetchResults();
  };

  const deleteResult = async (id) => {
    await api.delete(`/results/${id}`);
    fetchResults();
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <TextField label="Opponent" value={opponent} onChange={e=>setOpponent(e.target.value)} />
        <TextField label="Rating" value={rating} onChange={e=>setRating(e.target.value)} style={{ marginLeft: 10 }} />
        <TextField label="Result" value={result} onChange={e=>setResult(e.target.value)} style={{ marginLeft: 10 }} />
        <TextField label="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{ marginLeft: 10 }} />
        <Button variant="contained" onClick={addResult} style={{ marginLeft: 10 }}>Add Result</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Opponent</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.opponent}</TableCell>
              <TableCell>{r.rating}</TableCell>
              <TableCell>{r.result}</TableCell>
              <TableCell>{r.description}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={()=>deleteResult(r.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
