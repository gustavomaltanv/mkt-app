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

const baseURL = `${BASE_URL}/produtos`;

function ListagemProdutos() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);

  const cadastrar = () => {
    navigate(`/cadastro-produto`);
  };

  const editar = (id) => {
    navigate(`/cadastro-produto/${id}`);
  };

  const excluir = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      mensagemSucesso('Produto excluído com sucesso!');
      setProdutos(produtos.filter((produto) => produto.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir produto.');
    }
  };

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get(baseURL);
        setProdutos(response.data);
      } catch (error) {
        mensagemErro('Erro ao buscar produtos.');
      }
    };
    fetchProdutos();
  }, []);

  return (
    <div className='container'>
      <Card title='Listagem de Produtos'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-4'
                onClick={cadastrar}
              >
                Novo produto
              </button>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Descrição</th>
                    <th scope='col'>Preço</th>
                    <th scope='col'>Código de Barras</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto.id}>
                      <td>{produto.nome}</td>
                      <td>{produto.descricao}</td>
                      <td>{produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>{produto.codigoBarras}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(produto.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(produto.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemProdutos;