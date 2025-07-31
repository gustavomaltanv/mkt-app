import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';

import Card from '../components/Card';
import FormGroup from '../components/FormGroup';
import { mensagemSucesso, mensagemErro } from '../components/Toastr';
import { BASE_URL } from '../config/axios';

import Stack from '@mui/material/Stack';

function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logar = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/login/auth`, { 
        login: login,
        senha: senha,
      });

      localStorage.setItem('token', response.data.token);

      mensagemSucesso(`Usuário ${login} logado com sucesso!`);
      navigate('/');

    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        mensagemErro('Login ou senha inválidos.');
      } else {
        mensagemErro('Ocorreu um erro ao tentar fazer login. Tente novamente.');
        console.error("Erro de login:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cancelar = () => {
    setLogin('');
    setSenha('');
  };

  return (
    <ThemeProvider>
      
      <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
        <div className='col-lg-4'>
          <Card title='Acesso'>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='bs-component'>
                  <FormGroup label='Login: *' htmlFor='inputLogin'>
                    <input
                      type='text'
                      id='inputLogin'
                      value={login}
                      className='form-control'
                      name='login'
                      onChange={(e) => setLogin(e.target.value)}
                      placeholder="Digite seu login"
                    />
                  </FormGroup>
                  <FormGroup label='Senha: *' htmlFor='inputSenha'>
                    <input
                      type='password'
                      id='inputSenha'
                      value={senha}
                      className='form-control'
                      name='senha'
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Digite sua senha"
                    />
                  </FormGroup>
                  <Stack spacing={1} padding={1} direction='row'>
                    <button
                      onClick={logar}
                      type='button'
                      className='btn btn-success'
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                    <button
                      onClick={cancelar}
                      type='button'
                      className='btn btn-danger'
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                  </Stack>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Login;
