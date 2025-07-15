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

const comprasURL = `${BASE_URL}/compras`;
const usuariosURL = `${BASE_URL}/usuarios`;

function ListagemCompras() {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);

  const cadastrar = () => {
    navigate(`/cadastro-compra`);
  };

  const editar = (id) => {
    navigate(`/cadastro-compra/${id}`);
  };

  const excluir = async (id) => {
    try {
      await axios.delete(`${comprasURL}/${id}`);
      mensagemSucesso('Compra excluída com sucesso!');
      setCompras(compras.filter((compra) => compra.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir a compra.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca compras e usuários em paralelo para otimizar o carregamento
        const [comprasResponse, usuariosResponse] = await Promise.all([
          axios.get(comprasURL),
          axios.get(usuariosURL)
        ]);

        const todasCompras = comprasResponse.data;
        const todosUsuarios = usuariosResponse.data;

        // Cria um mapa de ID do usuário para o nome para busca rápida
        const userMap = todosUsuarios.reduce((map, user) => {
          map[user.id] = user.nome;
          return map;
        }, {});

        // Adiciona o nome do usuário a cada objeto de compra
        const comprasComNomes = todasCompras.map(compra => ({
          ...compra,
          nomeUsuario: userMap[compra.idUsuario] || 'Usuário não encontrado'
        }));

        setCompras(comprasComNomes);
      } catch (error) {
        mensagemErro('Erro ao carregar os dados.');
      }
    };

    fetchData();
  }, []);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
  }

  return (
    <div className='container'>
      <Card title='Listagem de Compras'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-4'
                onClick={cadastrar}
              >
                Nova compra
              </button>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Usuário</th>
                    <th scope='col'>Data da Compra</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map((compra) => (
                    <tr key={compra.id}>
                      <td>{compra.id}</td>
                      <td>{compra.nomeUsuario}</td>
                      <td>{formatarData(compra.dataCompra)}</td>
                      <td>{compra.status}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(compra.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(compra.id)}
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

export default ListagemCompras;