import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/FormGroup';

import { mensagemSucesso, mensagemErro } from '../components/toastr';



import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/produtos`;

function CadastroProduto() {
  const { idParam } = useParams();

  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidadeMaxima, setQuantidadeMaxima] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');

  const [dados, setDados] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setNome('');
      setDescricao('');
      setPreco('');
      setQuantidadeMaxima('');
      setCodigoBarras('');
    }
    else {
      setId(dados.id);
      setNome(dados.nome);
      setDescricao(dados.descricao);
      setPreco(dados.preco);
      setQuantidadeMaxima(dados.quantidadeMaxima);
      setCodigoBarras(dados.codigoBarras);
    }
  }

  async function salvar() {
    let data = {
      id,
      nome,
      descricao,
      preco,
      quantidadeMaxima,
      codigoBarras,
    };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Produto ${nome} cadastrado(a) com sucesso!`)
          navigate(`/listagem-produtos`);
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
          mensagemSucesso(`Produto ${nome} alterado(a) com sucesso!`);
          navigate(`/listagem-produtos`);
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
      setPreco(dados.preco);
      setQuantidadeMaxima(dados.quantidadeMaxima);
      setCodigoBarras(dados.codigoBarras);
    }
  }

  useEffect(() => {
    buscar();
  }, [id]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Produto'>
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

              <FormGroup label='Preço: *' htmlFor='inputPreco'>
                <input
                  type="number"
                  id="inputPreco"
                  value={preco}
                  className="form-control"
                  name="preco"
                  onChange={(e) => setPreco(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Quantidade máxima: *' htmlFor='inputQuantidadeMaxima'>
                <input
                  type='number'
                  id='inputQuantidadeMaxima'
                  value={quantidadeMaxima}
                  className='form-control'
                  name='quantidadeMaxima'
                  onChange={(e) => setQuantidadeMaxima(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Código de barras: *' htmlFor='inputCodigoBarras'>
                <input
                  type='number'
                  id='inputCodigoBarras'
                  value={codigoBarras}
                  className='form-control'
                  name='codigoBarras'
                  onChange={(e) => setCodigoBarras(e.target.value)}
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

export default CadastroProduto;
