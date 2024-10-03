import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert, Link, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

// Create custom styles using makeStyles hook
const useStyles = makeStyles({
  formContainer: {
    maxWidth: '350px', // Explicit max-width to control the form width
    width: '100%',
    marginTop: '50px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    margin: 'auto',
  },
  button: {
    backgroundColor: 'teal',
    padding: '10px 0',
    textTransform: 'none',
    width: '100%',
    marginTop: '20px',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#00695c',
    },
  },
  inputField: {
    marginBottom: '20px',
  },
  typography: {
    fontWeight: 'bold',
    color: 'teal',
    marginBottom: '30px',
  },
});

function RegisterPage() {
  const classes = useStyles(); // Use the custom styles
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const navigate = useNavigate();

  // Helper function to validate email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Both email and password are required');
      return;
    }

    setError('');
    setLoadingLocal(true);

    try {
      await register({ email, password });
      navigate('/login');
    } catch (error) {
      setError('Registration failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <Container className={classes.formContainer}>
      <Typography variant="h4" className={classes.typography}>
        Sign Up
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: '16px' }}>{error}</Alert>}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(''); // Clear error on input change
        }}
        error={!!error && (!email || !isValidEmail(email))} // Validate email format
        helperText={(!email && error) ? 'Email is required' : (!isValidEmail(email) && 'Invalid email format')}
        className={classes.inputField}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(''); // Clear error on input change
        }}
        error={!!error && !password}
        helperText={(!password && error) ? 'Password is required' : ''}
        className={classes.inputField}
      />

      <Button
        variant="contained"
        className={classes.button}
        onClick={handleRegister}
        disabled={loadingLocal} // Disable while loading
      >
        {loadingLocal ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
      </Button>

      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Already have an account?{' '}
        <Link href="/login" sx={{ color: 'teal', fontWeight: 'bold' }}>
          Login
        </Link>
      </Typography>
    </Container>
  );
}

export default RegisterPage;
