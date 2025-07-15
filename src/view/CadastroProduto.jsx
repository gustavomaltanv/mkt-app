import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Card from '../components/Card';
import FormGroup from '../components/FormGroup';
import { mensagemSucesso, mensagemErro } from '../components/Toastr';
import { BASE_URL } from '../config/axios';

import Stack from '@mui/material/Stack';

const baseURL = `${BASE_URL}/produtos`;

function CadastroProduto() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const isNew = idParam === undefined;

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [caminhoFoto, setCaminhoFoto] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');

  useEffect(() => {
    if (!isNew) {
      axios.get(`${baseURL}/${idParam}`)
        .then(response => {
          const { data } = response;
          setNome(data.nome);
          setDescricao(data.descricao);
          setPreco(data.preco);
          setCaminhoFoto(data.caminhoFoto);
          setCodigoBarras(data.codigoBarras);
        })
        .catch(error => {
          mensagemErro('Produto não encontrado.');
          navigate('/listagem-produtos');
        });
    }
  }, [idParam, isNew, navigate]);

  const salvar = async () => {
    // Validação
    if (!nome || !descricao || !preco || !codigoBarras) {
      mensagemErro('Todos os campos com * são obrigatórios.');
      return;
    }

    const data = {
      nome,
      descricao,
      preco: parseFloat(preco), // Garante que o preço é um número
      caminhoFoto,
      codigoBarras,
    };

    const request = isNew
      ? axios.post(baseURL, data)
      : axios.put(`${baseURL}/${idParam}`, data);

    try {
      await request;
      const message = isNew ? 'Produto cadastrado com sucesso!' : 'Produto atualizado com sucesso!';
      mensagemSucesso(message);
      navigate('/listagem-produtos');
    } catch (error) {
      mensagemErro(error.response?.data?.message || 'Erro ao salvar o produto.');
    }
  };

  const cancelar = () => {
    navigate('/listagem-produtos');
  };

  return (
    <div className='container'>
      <Card title={isNew ? 'Cadastro de Produto' : 'Edição de Produto'}>
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
              
              <FormGroup label='Caminho da Foto:' htmlFor='inputCaminhoFoto'>
                <input
                  type='text'
                  id='inputCaminhoFoto'
                  value={caminhoFoto}
                  className='form-control'
                  name='caminhoFoto'
                  onChange={(e) => setCaminhoFoto(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Preço: *' htmlFor='inputPreco'>
                <input
                  type="number"
                  step="0.01"
                  id="inputPreco"
                  value={preco}
                  className="form-control"
                  name="preco"
                  onChange={(e) => setPreco(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Código de Barras: *' htmlFor='inputCodigoBarras'>
                <input
                  type='text'
                  id='inputCodigoBarras'
                  value={codigoBarras}
                  className='form-control'
                  name='codigoBarras'
                  onChange={(e) => setCodigoBarras(e.target.value)}
                />
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

export default CadastroProduto;