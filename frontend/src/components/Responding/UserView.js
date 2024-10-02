import React from 'react';
import { Typography, Paper, Grid, CircularProgress } from '@mui/material';

const UserView = ({ user, responses }) => {
  if (!user || !responses) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <CircularProgress />
        <Typography>Loading user data...</Typography>
      </div>
    );
  }

  return (
    <Paper sx={{ padding: 3, marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>User: {user.name}</Typography>
      <Typography variant="subtitle1" gutterBottom>User ID: {user.id}</Typography>

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {responses.length > 0 ? (
          responses.map((response, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Response {index + 1}</Typography>
                <Typography variant="body2">Question ID: {response.questionId}</Typography>
                <Typography variant="body2">Option ID: {response.optionId}</Typography>
                <Typography variant="body2">Option Text: {response.optionText || 'No response provided'}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" sx={{ marginTop: 2 }}>No responses found for this user.</Typography>
        )}
      </Grid>
    </Paper>
  );
};

export default UserView;
