import React, { useState } from 'react';
import { Container, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Custom styles using makeStyles hook
const useStyles = makeStyles((theme) => ({
  formContainer: {
    maxWidth: '320px', // Smaller max-width to make the form more compact
    width: '100%',
    marginTop: '80px', // Slightly more space from the top
    padding: '25px',
    backgroundColor: '#f9f9f9', // Light background for contrast
    borderRadius: '12px',
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)', // Softer shadow for a clean look
    textAlign: 'center',
    margin: 'auto', // Center the form on the page
    border: '1px solid #ddd', // Border to add a subtle outline
  },
  button: {
    backgroundColor: '#00796b', // Use a more saturated teal color
    padding: '12px 0',
    textTransform: 'none',
    width: '100%',
    marginTop: '20px',
    color: '#fff',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#004d40', // Darker teal on hover for better interaction feedback
    },
  },
  inputField: {
    marginBottom: '16px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px', // Softer edges for inputs
    },
  },
  typography: {
    fontWeight: 'bold',
    color: '#00796b', // Teal color to match button
    marginBottom: '24px',
    fontFamily: 'Roboto, sans-serif', // Clean, modern font
  },
  helperText: {
    textAlign: 'left',
  },
}));

function LoginPage() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Helper function to validate email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Both email and password are required');
      return;
    }

    setError('');
    setLoadingLocal(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Login failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <Container className={classes.formContainer}>
      <Typography variant="h4" className={classes.typography}>
        Login
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
        FormHelperTextProps={{ className: classes.helperText }}
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
        FormHelperTextProps={{ className: classes.helperText }}
      />

      <Button
        variant="contained"
        className={classes.button}
        onClick={handleLogin}
        disabled={loadingLocal}
      >
        {loadingLocal ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </Button>

      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Don't have an account?{' '}
        <Button component="a" href="/register" sx={{ color: '#00796b', fontWeight: 'bold' }}>
          Sign Up
        </Button>
      </Typography>
    </Container>
  );
}

export default LoginPage;
