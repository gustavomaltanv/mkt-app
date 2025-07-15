import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Card from '../components/Card';
import FormGroup from '../components/FormGroup';
import { mensagemSucesso, mensagemErro } from '../components/Toastr';
import { BASE_URL } from '../config/axios';

import Stack from '@mui/material/Stack';

const sugestoesURL = `${BASE_URL}/sugestoes`;
const usuariosURL = `${BASE_URL}/usuarios`;

function CadastroSugestao() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const isNew = idParam === undefined;

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [status, setStatus] = useState('PENDENTE'); // Valor padrão

  // Estado para armazenar a lista de usuários
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Busca a lista de todos os usuários para popular o select
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(usuariosURL);
        setUsuarios(response.data);
      } catch (error) {
        mensagemErro('Falha ao carregar a lista de usuários.');
      }
    };

    fetchUsuarios();

    // Se estiver editando, busca os dados da sugestão
    if (!isNew) {
      axios.get(`${sugestoesURL}/${idParam}`)
        .then(response => {
          const { data } = response;
          setNome(data.nome);
          setStatus(data.status);
          setIdUsuario(data.idUsuario);
        })
        .catch(error => {
          mensagemErro('Sugestão não encontrada.');
          navigate('/listagem-sugestoes');
        });
    }
  }, [idParam, isNew, navigate]);

  const salvar = async () => {
    // Validação simples
    if (!nome || !idUsuario) {
      mensagemErro('Os campos Nome e Usuário são obrigatórios.');
      return;
    }

    const data = {
      nome,
      idUsuario: Number(idUsuario), // Garante que o ID é um número
      status,
    };

    const request = isNew
      ? axios.post(sugestoesURL, data)
      : axios.put(`${sugestoesURL}/${idParam}`, data);

    try {
      await request;
      const message = isNew ? 'Sugestão cadastrada com sucesso!' : 'Sugestão atualizada com sucesso!';
      mensagemSucesso(message);
      navigate('/listagem-sugestoes');
    } catch (error) {
      mensagemErro(error.response?.data?.message || 'Erro ao salvar sugestão.');
    }
  };

  const cancelar = () => {
    navigate('/listagem-sugestoes');
  };

  return (
    <div className='container'>
      <Card title={isNew ? 'Cadastro de Sugestão' : 'Edição de Sugestão'}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome do Produto: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nome'
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Usuário: *' htmlFor='inputUsuario'>
                <select
                  id="inputUsuario"
                  value={idUsuario}
                  className="form-control form-select"
                  name="usuario"
                  onChange={(e) => setIdUsuario(e.target.value)}
                >
                  <option value="">Selecione um usuário</option>
                  {usuarios.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label='Status: *' htmlFor='inputStatus'>
                <select
                  id="inputStatus"
                  value={status}
                  className="form-control form-select"
                  name="status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="RECUSADO">Recusado</option>
                </select>
              </FormGroup>

              <Stack spacing={1} padding={1} direction='row' className="mt-3">
                <button onClick={salvar} type='button' className='btn btn-success'>
                  Salvar
                </button>
                <button onClick={cancelar} type='button' className='btn btn-danger'>
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroSugestao;