import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Card from '../components/Card';
import FormGroup from '../components/FormGroup';
import { mensagemSucesso, mensagemErro } from '../components/Toastr';
import { BASE_URL } from '../config/axios';

import Stack from '@mui/material/Stack';

const estoquesURL = `${BASE_URL}/estoques`;
const produtosURL = `${BASE_URL}/produtos`;

function CadastroEstoque() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const isNew = idParam === undefined;

  // Estados do formulário
  const [idProduto, setIdProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');

  // Estados para dados de apoio
  const [produtos, setProdutos] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);

  // Efeito para carregar dados iniciais (produtos e estoques existentes)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [produtosResponse, estoquesResponse] = await Promise.all([
          axios.get(produtosURL),
          axios.get(estoquesURL),
        ]);

        const todosProdutos = produtosResponse.data;
        const todosEstoques = estoquesResponse.data;
        setProdutos(todosProdutos);

        // Cria uma lista de IDs de produtos que já estão no estoque
        const produtosEmEstoqueIds = new Set(todosEstoques.map(e => e.idProduto));
        
        // Filtra para obter apenas produtos que ainda não têm estoque
        const produtosSemEstoque = todosProdutos.filter(p => !produtosEmEstoqueIds.has(p.id));
        setProdutosDisponiveis(produtosSemEstoque);

      } catch (error) {
        mensagemErro('Erro ao carregar dados de produtos.');
      }
    };
    loadInitialData();
  }, []);

  // Efeito para carregar dados do estoque em modo de edição
  useEffect(() => {
    if (!isNew) {
      axios.get(`${estoquesURL}/${idParam}`)
        .then(response => {
          const { data } = response;
          setIdProduto(data.idProduto);
          setQuantidade(data.quantidade);
        })
        .catch(error => {
          mensagemErro('Registro de estoque não encontrado.');
          navigate('/listagem-estoques');
        });
    }
  }, [idParam, isNew, navigate]);
  
  const salvar = async () => {
    if (!idProduto || !quantidade) {
      mensagemErro('Os campos Produto e Quantidade são obrigatórios.');
      return;
    }

    const dadosEstoque = {
      idProduto: Number(idProduto),
      quantidade: Number(quantidade),
    };

    const request = isNew
      ? axios.post(estoquesURL, dadosEstoque)
      : axios.put(`${estoquesURL}/${idParam}`, dadosEstoque);

    try {
      await request;
      const message = isNew ? 'Estoque cadastrado com sucesso!' : 'Estoque atualizado com sucesso!';
      mensagemSucesso(message);
      navigate('/listagem-estoques');
    } catch (error) {
      mensagemErro(error.response?.data?.message || 'Erro ao salvar o registro de estoque.');
    }
  };

  const cancelar = () => {
    navigate('/listagem-estoques');
  };

  // Função para obter o nome do produto selecionado (usado no modo de edição)
  const getNomeProdutoSelecionado = () => {
      if(idProduto) {
        const produto = produtos.find(p => p.id === Number(idProduto));
        return produto ? produto.nome : '';
      }
      return '';
  }

  return (
    <div className='container'>
      <Card title={isNew ? 'Cadastro de Estoque' : 'Edição de Estoque'}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Produto: *' htmlFor='inputProduto'>
                {isNew ? (
                  <select
                    id="inputProduto"
                    className="form-control form-select"
                    value={idProduto}
                    onChange={(e) => setIdProduto(e.target.value)}
                  >
                    <option value="">Selecione um produto</option>
                    {produtosDisponiveis.map(produto => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    value={getNomeProdutoSelecionado()}
                    disabled // Desabilita a alteração do produto no modo de edição
                  />
                )}
              </FormGroup>

              <FormGroup label='Quantidade: *' htmlFor='inputQuantidade'>
                <input
                  type='number'
                  id='inputQuantidade'
                  value={quantidade}
                  className='form-control'
                  min="0"
                  onChange={(e) => setQuantidade(e.target.value)}
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

export default CadastroEstoque;