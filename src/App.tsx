import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import './App.css';
import testFirebase from './models/firestore-test';

function App() {
  const [success, setSuccess] = useState<boolean|undefined>(undefined)
  return (
    <Box>
      <Button onClick={async () => setSuccess(await testFirebase())}>Test</Button>
      <Typography>{success === undefined ? String(success): null }</Typography>
    </Box>
  );
}

export default App;
