import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Card, CardContent, CardActionArea, CardMedia,
  CssBaseline, Grid, Typography, Container,
  Paper, useTheme, Box, Link
} from '@mui/material';

export default function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const cardContentStyle = {
    minHeight: '150px',  // Set a minimum height to align the content heights
  };

  const cardMediaStyle = {
    height: '180px',  // Adjusted to ensure consistent height for card media images
    objectFit: 'cover',
  };

  return (
    <div>
      <CssBaseline />

      <main style={{ textAlign: 'start' }}>
        <Container>
          <div>
            <Paper style={{
              position: 'relative',
              backgroundColor: theme.palette.grey[800],
              color: theme.palette.common.white,
              marginBottom: theme.spacing(4),
              backgroundImage: 'url(https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: 'rgba(0,0,0,.3)',
              }} />
              <Grid container>
                <Grid item md={6}>
                  <Box sx={{
                    position: 'relative',
                    padding: theme.spacing(3),
                    [theme.breakpoints.up('md')]: {
                      padding: theme.spacing(6),
                      paddingRight: 0,
                    },
                  }}>
                    <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                      Feedback-Survey-System
                    </Typography>
                    <Typography variant="h5" color="inherit" paragraph>
                      Collect feedback from your users, analyze it, and improve your service. Easy to use, customizable surveys to gather the insights you need.
                    </Typography>
                    <div style={{ marginTop: theme.spacing(4), display: 'flex', gap: '20px' }}>
                      <Button variant="contained" color="primary" style={{ backgroundColor: 'teal', padding: '10px 20px' }} onClick={handleSignupClick}>
                        Get Started for FREE
                      </Button>
                      <Button variant="contained" color="primary" style={{ backgroundColor: '#008080', padding: '10px 20px' }} onClick={handleLoginClick}>
                        Login
                      </Button>
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Cards Section */}
            <Grid container spacing={4} style={{ marginTop: '2rem' }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardActionArea component="a" href="/">
                    <CardMedia
                      component="img"
                      image="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
                      title="Gather Feedback"
                      style={cardMediaStyle}
                    />
                    <CardContent style={cardContentStyle}>
                      <Typography component="h2" variant="h5">
                        Gather Feedback Effortlessly
                      </Typography>
                      <Typography variant="subtitle1" style={{ color: 'teal' }}>
                        Collect
                      </Typography>
                      <Typography variant="subtitle1" paragraph>
                        Use our platform to collect feedback from your users, customers, or employees. Our easy-to-use interface lets you create customizable feedback forms in minutes.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardActionArea component="a" href="/">
                    <CardMedia
                      component="img"
                      image="https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg"
                      title="Analyze Results"
                      style={cardMediaStyle}
                    />
                    <CardContent style={cardContentStyle}>
                      <Typography component="h2" variant="h5">
                        Analyze Results in Real-Time
                      </Typography>
                      <Typography variant="subtitle1" style={{ color: 'teal' }}>
                        Analyze
                      </Typography>
                      <Typography variant="subtitle1" paragraph>
                      Receive immediate insights from your collected feedback. Leverage dynamic charts and graphs to interpret the data, and export your findings for in-depth evaluation.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>

            {/* How It Works Section */}
            <Box sx={{ textAlign: 'center', marginTop: '3rem' }}>
              <Typography variant="h4" gutterBottom>How It Works</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>Step 1: Create Your Survey</Typography>
                    <Typography>Use our simple interface to create a survey in minutes. Add different types of questions like multiple-choice, ratings, and more.</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>Step 2: Distribute the Survey</Typography>
                    <Typography>Easily share the survey with your target audience via email, social media, or embed it on your website.</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>Step 3: Analyze Responses</Typography>
                    <Typography>Collect real-time responses, visualize the data using interactive charts, and gain insights to improve your service.</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

          </div>
        </Container>
      </main>

      <footer style={{ backgroundColor: '#DAE0E2', padding: theme.spacing(4), marginTop: '50px' }}>
        <Typography variant="h6" align="center" gutterBottom>
          Feedback-Survey-System
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Our platform simplifies feedback collection and analysis to help you improve your services and products.
        </Typography>
        <Box sx={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/privacy-policy" color="inherit">Privacy Policy</Link> | <Link href="/terms-of-service" color="inherit">Terms of Service</Link>
        </Box>
        <Copyright />
      </footer>
    </div>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      © {new Date().getFullYear()} {' '}
      <Link color="inherit" href="https://github.com/vandana2425">
        Vandana B Gowda & Yuktha MS
      </Link>
    </Typography>
  );
}
