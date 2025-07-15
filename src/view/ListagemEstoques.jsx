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

const estoquesURL = `${BASE_URL}/estoques`;
const produtosURL = `${BASE_URL}/produtos`;

function ListagemEstoques() {
  const navigate = useNavigate();
  const [estoques, setEstoques] = useState([]);

  const cadastrar = () => {
    navigate(`/cadastro-estoque`);
  };

  const editar = (id) => {
    navigate(`/cadastro-estoque/${id}`);
  };

  const excluir = async (id) => {
    try {
      await axios.delete(`${estoquesURL}/${id}`);
      mensagemSucesso('Registro de estoque excluído com sucesso!');
      setEstoques(estoques.filter((estoque) => estoque.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir registro de estoque.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca estoques e produtos em paralelo
        const [estoquesResponse, produtosResponse] = await Promise.all([
          axios.get(estoquesURL),
          axios.get(produtosURL),
        ]);

        const todosEstoques = estoquesResponse.data;
        const todosProdutos = produtosResponse.data;

        // Cria um mapa para acesso rápido aos nomes dos produtos
        const produtoMap = todosProdutos.reduce((map, produto) => {
          map[produto.id] = produto.nome;
          return map;
        }, {});

        // Adiciona o nome do produto a cada registro de estoque
        const estoquesComNomes = todosEstoques.map(estoque => ({
          ...estoque,
          produtoNome: produtoMap[estoque.idProduto] || 'Produto não encontrado',
        }));

        setEstoques(estoquesComNomes);
      } catch (error) {
        mensagemErro('Erro ao carregar os dados de estoques ou produtos.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className='container'>
      <Card title='Listagem de Estoques'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-4'
                onClick={cadastrar}
              >
                Novo Estoque
              </button>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>Produto</th>
                    <th scope='col'>Quantidade</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {estoques.map((estoque) => (
                    <tr key={estoque.id}>
                      <td>{estoque.produtoNome}</td>
                      <td>{estoque.quantidade}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            color="inherit"
                            onClick={() => editar(estoque.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            color="inherit"
                            onClick={() => excluir(estoque.id)}
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

export default ListagemEstoques;