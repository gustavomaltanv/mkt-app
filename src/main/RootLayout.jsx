import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';

function RootLayout() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </ThemeProvider>
  );
}

export default RootLayout;