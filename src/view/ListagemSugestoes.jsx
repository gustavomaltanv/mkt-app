import { useState, useEffect } from 'react';

import Card from '../components/Card';

import { mensagemSucesso, mensagemErro } from '../components/Toastr';

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL2 } from '../config/axios';

const baseURL = `${BASE_URL2}/sugestoes`;

function ListagemSugestoes() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-sugestao`);
  };

  const editar = (id) => {
    navigate(`/cadastro-sugestao/${id}`);
  };

  const [dados, setDados] = useState(null);

  async function excluir(id) {
    let data = JSON.stringify({ id });
    let url = `${baseURL}/${id}`;
    console.log(url)
    await axios
      .delete(url, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(function (response) {
        mensagemSucesso(`Sugestão excluída com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir sugestão`);
      });
  }

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setDados(response.data);
    });
  }, []);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Listagem de Sugestões'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-4'
                onClick={() => cadastrar()}
              >
                Nova sugestão
              </button>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Descrição</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Data de Criação</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>

                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
                      <td>{dado.descricao}</td>
                      <td>{dado.status}</td>
                      <td>{dado.dataCriacao}</td>

                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(dado.id)}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            aria-label='delete'
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

export default ListagemSugestoes;
