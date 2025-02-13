import { useState, useEffect } from 'react';

import Card from '../components/card';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL3 } from '../config/axios';

const baseURL = `${BASE_URL3}/compras`;

function ListagemCompras() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-compra`);
  };

  const editar = (id) => {
    navigate(`/cadastro-compra/${id}`);
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
        mensagemSucesso(`Histórico excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir histórico`);
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
      <Card title='Listagem de Históricos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-4'
                onClick={() => cadastrar()}
              >
                Nova compra
              </button>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Usuario</th>
                    <th scope='col'>Data</th>
                    <th scope='col'>Pagamento</th>
                    <th scope='col'>Valor</th>
                    <th scope='col'>Status</th>

                    <th></th>
                  </tr>
                </thead>
                <tbody>

                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.id}</td>
                      <td>{dado.nome}</td>
                      <td>{dado.dataCompra}</td>
                      <td>{dado.pagamento.tipoPagamento}</td>
                      <td>{dado.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>{dado.statusCarrinho}</td>

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

export default ListagemCompras;
