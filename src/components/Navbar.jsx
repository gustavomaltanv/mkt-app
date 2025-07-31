import React, { useContext } from 'react';
import NavbarItem from "./NavbarItem";
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navClass = theme === 'dark' 
    ? "navbar navbar-expand-lg bg-dark mb-2" 
    : "navbar navbar-expand-lg bg-light mb-2";

  return (
    <>
      <nav className={navClass} data-bs-theme={theme}>
        <div className="container">
          <a className="navbar-brand" href="/">MKT</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor02">

            <ul className="navbar-nav me-auto">
              <NavbarItem render={true} href='/listagem-compras' label='Compras' />
              <NavbarItem render={true} href='/listagem-produtos' label='Produtos' />
              <NavbarItem render={true} href='/listagem-sugestoes' label='Sugestões' />
              
              <NavbarItem render={isAdmin} href='/listagem-estoques' label='Estoques' />
              <NavbarItem render={isAdmin} href='/listagem-usuarios' label='Usuários' />
            </ul>

            <ul className="navbar-nav ms-auto d-flex align-items-center">
                <li className="nav-item me-2">
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={toggleTheme}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </li>
            </ul>
            
          </div>
        </div>
      </nav>
    </>
  )
}