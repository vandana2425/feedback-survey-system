// src/components/responding/FooterTrash.js

import React from 'react';
import { Typography, Container } from '@mui/material';

function FooterTrash() {
  return (
    <footer style={{ padding: '20px', backgroundColor: '#f1f1f1', textAlign: 'center' }}>
      <Container>
        <Typography variant="body2" color="textSecondary">
          {'Copyright © '}
          <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">
            Your Website
          </a>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </footer>
  );
}

export default FooterTrash;
