import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Card from '../components/Card';
import { mensagemSucesso, mensagemErro } from '../components/Toastr';
import { BASE_URL } from '../config/axios';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const baseURL = `${BASE_URL}/usuarios`;

function ListagemUsuarios() {
  const navigate = useNavigate();

  const [dados, setDados] = useState([]);

  const cadastrar = () => {
    navigate(`/cadastro-usuario`);
  };

  const editar = (id) => {
    navigate(`/cadastro-usuario/${id}`);
  };

  const excluir = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      mensagemSucesso('Usuário excluído com sucesso!');
      setDados(dados.filter((dado) => dado.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir usuário');
    }
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(baseURL);
        setDados(response.data);
      } catch (error) {
        mensagemErro('Erro ao buscar usuários');
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <div className='container'>
      <Card title='Listagem de Usuários'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-4'
                onClick={cadastrar}
              >
                Novo usuário
              </button>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Telefone</th>
                    <th scope='col'>CPF</th>
                    <th scope='col'>Data de Cadastro</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
                      <td>{dado.email}</td>
                      <td>{dado.telefone}</td>
                      <td>{dado.cpf}</td>
                      <td>{new Date(dado.dataCadastro).toLocaleDateString()}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            color="inherit"
                            onClick={() => editar(dado.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            color="inherit"
                            onClick={() => excluir(dado.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>{' '}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemUsuarios;