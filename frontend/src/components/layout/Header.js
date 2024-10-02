import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, InputBase } from '@mui/material';
import { Home, Search, Add, AccountCircle } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import auth from '../../services/authService'; // Assuming authService handles login/logout

const SearchContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCreateFormRedirect = () => {
    navigate('/create-form'); // Redirect to create form page
  };

  const handleLogout = () => {
    if (window.confirm("Do you really want to log out?")) {
      auth.logout();
      navigate('/');
    }
  };

  const handleHomeClick = () => {
    navigate('/'); 
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    // Trigger a search or filtering function based on the searchQuery
    console.log("Search Query: ", searchQuery);
    // You can implement logic here to filter data, e.g., forms, surveys, etc.
  };

  return (
    <AppBar position="relative" style={{ backgroundColor: '#008080' }}>
      <Toolbar>
        {/* Home Button */}
        <IconButton edge="start" color="inherit" aria-label="home" onClick={handleHomeClick}>
          <Home />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" color="inherit" noWrap style={{ flexGrow: 1 }}>
          Feedback-Survey-System
        </Typography>

        {/* Search Bar */}
        <SearchContainer>
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={handleSearch} // Capture search input
          />
        </SearchContainer>

        {/* Add Button */}
        <IconButton color="inherit" onClick={handleCreateFormRedirect}>
          <Add />
        </IconButton>

        {/* Account/Logout Button */}
        <IconButton color="inherit" onClick={handleLogout}>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
