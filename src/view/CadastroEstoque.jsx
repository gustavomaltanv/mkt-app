import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/Card';
import FormGroup from '../components/FormGroup';

import { mensagemSucesso, mensagemErro } from '../components/Toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/estoques`;
const baseURLProdutos = `${BASE_URL}/produtos`;

function CadastroEstoque() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [produtoNome, setProdutoNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [lote, setLote] = useState('');
  const [validade, setValidade] = useState('');
  const [dados, setDados] = useState({});
  const [produtos, setProdutos] = useState([]);

  const inicializar = () => {
    if (!idParam) {
      setId('');
      setProdutoNome('');
      setQuantidade('');
      setLote('');
      setValidade('');
    }
  };

  const salvar = async () => {
    let data = {
      id,
      produtoNome,
      quantidade,
      lote,
      validade,
    };
    data = JSON.stringify(data);
    if (!idParam) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(() => {
          mensagemSucesso(`Estoque ${lote} cadastrado(a) com sucesso!`);
          navigate(`/listagem-estoques`);
        })
        .catch((error) => {
          mensagemErro(error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(() => {
          mensagemSucesso(`Estoque ${lote} alterado(a) com sucesso!`);
          navigate(`/listagem-estoques`);
        })
        .catch((error) => {
          mensagemErro(error.response.data);
        });
    }
  };

  const buscar = async () => {
    if (idParam) {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const data = response.data;
      setDados(data);
      setId(data.id);
      setProdutoNome(data.nome);
      setQuantidade(data.quantidade);
      setLote(data.lote);
      setValidade(data.validade);
    }
  };

  const getProdutos = async () => {
    const response = await axios.get(`${baseURLProdutos}`);
    setProdutos(response.data);
  };

  const setSelectValue = (selectId, value) => {
    const selectElement = document.getElementById(selectId);
    if (selectElement) {
      selectElement.value = value;
    }
  };

  useEffect(() => {
    getProdutos();
  }, []);

  useEffect(() => {
    buscar();
    setSelectValue('inputProdutoNome', dados.produtoNome);
  }, [produtos]);

  return (
    <div className='container'>
      <Card title='Cadastro de Estoque'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Lote: *' htmlFor='inputLote'>
                <input
                  type='text'
                  id='inputLote'
                  value={lote}
                  className='form-control'
                  name='lote'
                  onChange={(e) => setLote(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Produto: *' htmlFor='inputProdutoNome'>
                <select
                  id='inputProdutoNome'
                  value={produtoNome}
                  className='form-control form-select'
                  name='produtoNome'
                  onChange={(e) => setProdutoNome(e.target.value)}
                >
                  <option value='' disabled>
                    Selecione um produto
                  </option>
                  {produtos.map((dado) => (
                    <option key={dado.id} value={dado.nome}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label='Quantidade: *' htmlFor='inputQuantidade'>
                <input
                  type='number'
                  id='inputQuantidade'
                  value={quantidade}
                  className='form-control'
                  name='quantidade'
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Data de Validade: *' htmlFor='inputValidade'>
                <input
                  type='date'
                  id='inputValidade'
                  value={validade}
                  className='form-control'
                  name='validade'
                  onChange={(e) => setValidade(e.target.value)}
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
                  onClick={() => navigate('/listagem-estoques')}
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

export default CadastroEstoque;
