import React, { createContext, useState, useEffect, useMemo } from 'react';

// Cria o Contexto
export const ThemeContext = createContext();

// Cria o componente Provedor
export const ThemeProvider = ({ children }) => {
  // Estado para o tema, buscando do localStorage ou usando 'light' como padrão
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'light';
  });

  // Efeito que roda quando o tema muda
  useEffect(() => {
    // Aplica o tema na tag <html> do documento
    document.documentElement.setAttribute('data-bs-theme', theme);
    // Salva a escolha do usuário no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // O valor do contexto que será fornecido aos componentes filhos
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};