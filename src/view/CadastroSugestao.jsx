import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/Card';
import FormGroup from '../components/FormGroup';

import { mensagemSucesso, mensagemErro } from '../components/Toastr';



import axios from 'axios';
import { BASE_URL2 } from '../config/axios';

const baseURL = `${BASE_URL2}/sugestoes`;

function CadastroSugestao() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataCriacao, setDataCriacao] = useState(new Date());
  const [status, setStatus] = useState('');

  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNome('');
      setDescricao('');
      setDataCriacao(null);
      setStatus('');
    }
    else {
      setId(dados.id);
      setNome(dados.nome);
      setDescricao(dados.descricao);
      setDataCriacao(dados.dataCriacao);
      setStatus(dados.status);
    }
  }

  async function salvar() {
    let data = {
      id,
      nome,
      descricao,
      dataCriacao,
      status,
    };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Sugestão ${nome} cadastrado(a) com sucesso!`)
          navigate(`/listagem-sugestoes`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    }
    else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Sugestão ${nome} alterado(a) com sucesso!`);
          navigate(`/listagem-sugestoes`);
        })
        .catch(function (error) {
          mensagemErro(error.response.data);
        });
    }
  }

  async function buscar() {
    if (idParam != null) {
      await axios.get(`${baseURL}/${idParam}`).then((response) => {
        setDados(response.data);
      });
      setId(dados.id);
      setNome(dados.nome);
      setDescricao(dados.descricao);
      setDataCriacao(dados.dataCriacao);
      setStatus(dados.status);
    }
  }

  useEffect(() => {
    buscar();
  }, [id]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Sugestão'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input
                  type='text'
                  id='inputNome'
                  value={nome}
                  className='form-control'
                  name='nome'
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Descrição: *' htmlFor='inputDescricao'>
                <input
                  type='text'
                  id='inputDescricao'
                  value={descricao}
                  className='form-control'
                  name='descricao'
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Status: *' htmlFor='inputStatus'>
                <select
                  id="inputStatus"
                  value={status}
                  className="form-control form-select"
                  name="status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Recusado">Recusado</option>
                  <option value="Aprovado">Aprovado</option>
                </select>
              </FormGroup>

              <FormGroup label='Data de Criação:' htmlFor='inputDataCriacao'>
                <input
                  type='date'
                  id='inputDataCriacao'
                  value={dataCriacao}
                  className='form-control'
                  name='dataCriacao'
                  onChange={(e) => setDataCriacao(e.target.value)}
                  disabled
                />
              </FormGroup>

              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                >
                  Salvar
                </button>
                <button
                  onClick={inicializar}
                  type='button'
                  className='btn btn-danger'
                >
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
