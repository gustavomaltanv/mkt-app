import React, { useContext } from 'react';
import NavbarItem from "./NavbarItem";
import { ThemeContext } from '../context/ThemeContext'; // 1. Importe o contexto

export function Navbar() {
  // 2. Acesse o tema e a função de troca
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Determina a classe da navbar com base no tema
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
              {/* Seus NavbarItem's continuam aqui... */}
              <li className="nav-item">
                <NavbarItem render='true' href='/listagem-compras' label='Compras' />
              </li>
              <li className="nav-item">
                <NavbarItem render='true' href='/listagem-produtos' label='Produtos' />
              </li>
              <li className="nav-item">
                <NavbarItem render='true' href='/listagem-estoques' label='Estoques' />
              </li>
              <li className="nav-item">
                <NavbarItem render='true' href='/listagem-sugestoes' label='Sugestões' />
              </li>
              <li className="nav-item">
                <NavbarItem render='true' href='/listagem-usuarios' label='Usuários' />
              </li>
            </ul>

            {/* 3. Adicione o botão de troca de tema */}
            <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={toggleTheme}
                    >
                        {/* Altera o ícone com base no tema */}
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </li>
            </ul>
            
          </div>
        </div>
      </nav>
    </>
  )
}