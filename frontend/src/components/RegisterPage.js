import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert, Link } from '@mui/material';
import { makeStyles } from '@mui/styles'; // Correct import
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../apiServices';

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
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser({ email, password });
      navigate('/login');
    } catch (error) {
      setError('Registration failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container className={classes.formContainer}>
      <Typography variant="h4" className={classes.typography}>
        Sign Up
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error && !email}
        helperText={(!email && error) ? 'Email is required' : ''}
        className={classes.inputField}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!error && !password}
        helperText={(!password && error) ? 'Password is required' : ''}
        className={classes.inputField}
      />

      <Button
        variant="contained"
        className={classes.button}
        onClick={handleRegister}
      >
        Sign Up
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
