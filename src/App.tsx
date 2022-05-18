import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React, { useState } from 'react';
import './App.css';
import testFirebase, { activity, clear } from './models/firestore-test';

function App() {
  const [success, setSuccess] = useState<string|undefined>(undefined)
  const [loading, setLoading] = useState(false)
  return (
    <Box>
      <Button onClick={async () => {
        setLoading(true)
        const result = await testFirebase()
        setSuccess(result)
        setLoading(false)
        }}>Test</Button>
      <Button onClick={async () => {
        setLoading(true)
        await clear()
        setLoading(false)
        }}>Clear</Button>

      <Button onClick={async () => {
              setLoading(true)
              try{
                await activity()
              } finally{
                setLoading(false)
              }
              
              
      }}>Activity</Button>


      {loading && <CircularProgress/>}
      {success !== undefined && <Typography>{success}</Typography>}
    </Box>
  );
}

export default App;
