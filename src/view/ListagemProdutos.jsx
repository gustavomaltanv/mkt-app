import { useState, useEffect } from 'react';

import Card from '../components/Card';

import { mensagemSucesso, mensagemErro } from '../components/Toastr';

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/produtos`;

function ListagemProdutos() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate(`/cadastro-produto`);
  };

  const editar = (id) => {
    navigate(`/cadastro-produto/${id}`);
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
        mensagemSucesso(`Produto excluído com sucesso!`);
        setDados(
          dados.filter((dado) => {
            return dado.id !== id;
          })
        );
      })
      .catch(function (error) {
        mensagemErro(`Erro ao excluir produto`);
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
      <Card title='Listagem de Produtos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-4'
                onClick={() => cadastrar()}
              >
                Novo produto
              </button>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Descrição</th>
                    <th scope='col'>Preço</th>
                    <th scope='col'>Qtd máxima</th>
                    <th scope='col'>Código de Barras</th>

                    <th></th>
                  </tr>
                </thead>
                <tbody>

                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.nome}</td>
                      <td>{dado.descricao}</td>
                      <td>{dado.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>{dado.quantidadeMaxima}</td>
                      <td>{dado.codigoBarras}</td>

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

export default ListagemProdutos;
