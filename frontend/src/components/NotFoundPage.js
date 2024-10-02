// src/components/NotFoundPage.js

import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ maxWidth: 600, textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h4">404 - Page Not Found</Typography>
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </Container>
  );
}

export default NotFoundPage;
