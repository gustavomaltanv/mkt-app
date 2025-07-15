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

const sugestoesURL = `${BASE_URL}/sugestoes`;
const usuariosURL = `${BASE_URL}/usuarios`;

function ListagemSugestoes() {
  const navigate = useNavigate();
  const [sugestoes, setSugestoes] = useState([]);

  const cadastrar = () => {
    navigate(`/cadastro-sugestao`);
  };

  const editar = (id) => {
    navigate(`/cadastro-sugestao/${id}`);
  };

  const excluir = async (id) => {
    try {
      await axios.delete(`${sugestoesURL}/${id}`);
      mensagemSucesso('Sugestão excluída com sucesso!');
      setSugestoes(sugestoes.filter((sugestao) => sugestao.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir sugestão');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Executa as duas requisições em paralelo
        const [sugestoesResponse, usuariosResponse] = await Promise.all([
          axios.get(sugestoesURL),
          axios.get(usuariosURL)
        ]);

        const todasSugestoes = sugestoesResponse.data;
        const todosUsuarios = usuariosResponse.data;

        // Cria um mapa para acesso rápido aos nomes dos usuários pelo ID
        const userMap = todosUsuarios.reduce((map, user) => {
          map[user.id] = user.nome;
          return map;
        }, {});

        // Adiciona o nome do usuário a cada sugestão
        const sugestoesComNomes = todasSugestoes.map(sugestao => ({
          ...sugestao,
          nomeUsuario: userMap[sugestao.idUsuario] || 'Usuário não encontrado'
        }));

        setSugestoes(sugestoesComNomes);
      } catch (error) {
        mensagemErro('Erro ao carregar dados. Verifique a API.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className='container'>
      <Card title='Listagem de Sugestões'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning mb-4'
                onClick={cadastrar}
              >
                Nova sugestão
              </button>
              <table className='table table-hover table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>Nome do Produto</th>
                    <th scope='col'>Usuário</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sugestoes.map((sugestao) => (
                    <tr key={sugestao.id}>
                      <td>{sugestao.nome}</td>
                      <td>{sugestao.nomeUsuario}</td>
                      <td>{sugestao.status}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(sugestao.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(sugestao.id)}
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

export default ListagemSugestoes;