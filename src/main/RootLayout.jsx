import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';

function RootLayout() {
  return (
    // 1. O ThemeProvider envolve tudo
    <ThemeProvider>
      {/* 2. A Navbar e o Outlet (onde as páginas são renderizadas) ficam dentro dele */}
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </ThemeProvider>
  );
}

export default RootLayout;