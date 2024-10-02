// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

function PrivateRoute({ children }) {
  const { auth, loading } = useAuth(); // Removed 'error'

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Checking Authentication...
        </Typography>
      </Box>
    );
  }

  return auth ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
