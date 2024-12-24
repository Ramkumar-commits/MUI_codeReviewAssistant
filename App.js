import React from 'react';
import { Container, Typography } from '@mui/material';
import CodeReviewForm from './components/CodeReviewForm';

function App() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Code Review Assistant
      </Typography>
      <CodeReviewForm />
    </Container>
  );
}

export default App;