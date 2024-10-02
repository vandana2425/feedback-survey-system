import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // We will use location to get the form details
import { Button, Container, Typography, Box, TextField } from '@mui/material';

const FormCreatedPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To retrieve the form ID or any data passed during navigation
  const [formLink, setFormLink] = useState(''); // Store the generated link

  useEffect(() => {
    // Assuming form ID is passed in the location state from CreateFormPage
    if (location.state && location.state.formId) {
      const generatedLink = `${window.location.origin}/form/${location.state.formId}`;
      setFormLink(generatedLink); // Set the shareable link
    }
  }, [location]);

  const handleViewForms = () => {
    navigate('/dashboard'); // Redirect to the dashboard to view forms
  };

  return (
    <Container sx={{ marginTop: 8, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Form Created Successfully!
      </Typography>

      {/* Display form link */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="body1">
          Your form has been created and is now available for use. You can share it using the link below:
        </Typography>

        {/* Shareable link */}
        {formLink && (
          <TextField
            value={formLink}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            sx={{ marginTop: 2, marginBottom: 2 }}
          />
        )}

        {/* Add a copy to clipboard button */}
        {formLink && (
          <Button
            variant="outlined"
            onClick={() => {
              navigator.clipboard.writeText(formLink);
              alert('Link copied to clipboard!');
            }}
            sx={{ marginTop: 2 }}
          >
            Copy Link
          </Button>
        )}
      </Box>

      {/* Button to view all forms */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleViewForms}
        sx={{ backgroundColor: 'teal', marginTop: 2 }}
      >
        View All Forms
      </Button>
    </Container>
  );
};

export default FormCreatedPage;
