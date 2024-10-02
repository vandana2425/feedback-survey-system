import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, CircularProgress } from '@mui/material'; 
import auth from '../services/authService';
import Forms from './Form/Forms';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state to show spinner while checking for user

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login'); 
      }
      setLoading(false); // Stop loading once user is fetched or redirected
    };

    fetchUser();
  }, [navigate]);

  const handleShareForm = (formId) => {
    const shareUrl = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('Form link copied to clipboard!'))
      .catch(() => alert('Failed to copy the link'));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography variant="h6">Loading Dashboard...</Typography>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        {user ? (
          <Forms userId={user.id} onShareForm={handleShareForm} />
        ) : (
          <Typography variant="h6" color="error">
            No user found
          </Typography>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
