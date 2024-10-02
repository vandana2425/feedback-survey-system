import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Adjust the path to where your Header component is located

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
