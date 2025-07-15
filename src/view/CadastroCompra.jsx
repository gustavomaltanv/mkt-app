import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Card from '../components/Card';
import FormGroup from '../components/FormGroup';
import { mensagemSucesso, mensagemErro } from '../components/Toastr';
import { BASE_URL } from '../config/axios';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// URLs dos endpoints
const comprasURL = `${BASE_URL}/compras`;
const usuariosURL = `${BASE_URL}/usuarios`;
const produtosURL = `${BASE_URL}/produtos`;
const itensURL = `${BASE_URL}/itens`;

function CadastroCompra() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const isNew = idParam === undefined;

  // Estados principais da Compra
  const [idUsuario, setIdUsuario] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [status, setStatus] = useState('PENDENTE');

  // Estados para gerenciar a UI
  const [usuarios, setUsuarios] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [itensDeCompra, setItensDeCompra] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Efeito para carregar dados iniciais (usuários e produtos)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [usuariosResponse, produtosResponse] = await Promise.all([
          axios.get(usuariosURL),
          axios.get(produtosURL),
        ]);
        setUsuarios(usuariosResponse.data);
        setProdutos(produtosResponse.data);
      } catch (error) {
        mensagemErro('Erro ao carregar dados de usuários ou produtos.');
      }
    };
    loadInitialData();
  }, []);

  // Efeito para carregar dados da compra (e seus itens) em modo de edição
  useEffect(() => {
    // Se for uma nova compra, define a data e para.
    if (isNew) {
        setDataCompra(new Date().toISOString().split('T')[0]);
        return;
    }

    const loadEditData = async () => {
        try {
            // Busca a compra específica e TODOS os itens em paralelo
            const [compraResponse, todosOsItensResponse] = await Promise.all([
                axios.get(`${comprasURL}/${idParam}`),
                axios.get(itensURL) 
            ]);

            // 1. Popula os dados da compra principal
            const compraData = compraResponse.data;
            setIdUsuario(compraData.idUsuario);
            setStatus(compraData.status);
            setDataCompra(compraData.dataCompra.split('T')[0]);

            // 2. Filtra os itens para pegar apenas os da compra atual
            const todosOsItens = todosOsItensResponse.data;
            const itensDestaCompra = todosOsItens.filter(
                (item) => item.idCompra === Number(idParam)
            );

            // Preenche os itens com os dados completos do produto (nome, preco)
            const itensCompletos = itensDestaCompra.map(item => {
                const produtoInfo = produtos.find(p => p.id === item.idProduto);
                return {
                    ...item,
                    nomeProduto: produtoInfo ? produtoInfo.nome : 'Produto não encontrado',
                    precoUnitario: produtoInfo ? produtoInfo.preco : 0
                }
            });

            setItensDeCompra(itensCompletos);

        } catch (error) {
            mensagemErro('Erro ao carregar dados da compra para edição.');
            navigate('/listagem-compras');
        }
    };

    // Só executa a busca se a lista de produtos já tiver sido carregada
    if (produtos.length > 0) {
        loadEditData();
    }
  }, [idParam, isNew, navigate, produtos]); // Adicionado 'produtos' à dependência

  const handleItemChange = (index, field, value) => {
    const updatedItens = [...itensDeCompra];
    const currentItem = updatedItens[index];
    
    currentItem[field] = value;

    // Se o produto for alterado, atualiza o preço unitário
    if (field === 'idProduto') {
      const produtoSelecionado = produtos.find(p => p.id === Number(value));
      currentItem.precoUnitario = produtoSelecionado ? produtoSelecionado.preco : 0;
    }
    
    setItensDeCompra(updatedItens);
  };
  
  const adicionarItem = () => {
    setItensDeCompra([...itensDeCompra, { idProduto: '', quantidade: 1, precoUnitario: 0 }]);
  };
  
  const excluirItem = (index) => {
    const updatedItens = [...itensDeCompra];
    updatedItens.splice(index, 1);
    setItensDeCompra(updatedItens);
  };

  const calcularTotal = () => {
    return itensDeCompra.reduce((total, item) => {
        const quantidade = Number(item.quantidade) || 0;
        const preco = Number(item.precoUnitario) || 0;
        return total + (quantidade * preco);
    }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const salvar = async () => {
    if (!idUsuario || !dataCompra) {
      mensagemErro('Usuário e Data da Compra são obrigatórios.');
      return;
    }
    setIsSaving(true);
  
    const dadosCompra = {
      idUsuario: Number(idUsuario),
      dataCompra: `${dataCompra}T00:00:00`, // Mantém um formato de hora fixo
      dataCriacao: new Date().toISOString(), // Atualiza a data de criação/atualização
      status,
    };
  
    try {
      if (isNew) {
        // 1. Cria a Compra
        const response = await axios.post(comprasURL, dadosCompra);
        const compraId = response.data.id;
        mensagemSucesso('Compra criada! Salvando itens...');
        
        // 2. Cria os Itens de Compra
        for (const item of itensDeCompra) {
          if(!item.idProduto) continue; // Pula itens sem produto selecionado
          const itemData = {
            idCompra: compraId,
            idProduto: Number(item.idProduto),
            quantidade: Number(item.quantidade),
          };
          await axios.post(itensURL, itemData);
        }
      } else {
        // ATUALIZAR COMPRA EXISTENTE
        // 1. Atualiza a compra principal
        await axios.put(`${comprasURL}/${idParam}`, dadosCompra);
        mensagemSucesso('Compra atualizada! Atualizando itens...');

        // 2. Lógica para sincronizar itens (excluir os antigos e criar os novos)
        // Primeiro, busca todos os itens antigos para saber quais deletar
        const todosOsItensResponse = await axios.get(itensURL);
        const itensAntigos = todosOsItensResponse.data.filter(i => i.idCompra === Number(idParam));

        // Deleta todos os itens antigos associados a esta compra
        for(const itemAntigo of itensAntigos) {
            await axios.delete(`${itensURL}/${itemAntigo.id}`);
        }

        // Cria os novos itens que estão no estado atual
        for (const itemNovo of itensDeCompra) {
            if(!itemNovo.idProduto) continue;
            const itemData = {
                idCompra: Number(idParam),
                idProduto: Number(itemNovo.idProduto),
                quantidade: Number(itemNovo.quantidade),
            };
            await axios.post(itensURL, itemData);
        }
      }
      
      mensagemSucesso('Compra salva com sucesso!');
      navigate('/listagem-compras');

    } catch (error) {
      mensagemErro('Ocorreu um erro ao salvar a compra ou seus itens.');
    } finally {
      setIsSaving(false);
    }
  };

  // ... (o resto do componente, incluindo o return, permanece o mesmo)

  return (
    <div className='container'>
      <Card title={isNew ? 'Cadastro de Compra' : 'Edição de Compra'}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Usuário: *' htmlFor='inputUsuario'>
                <select
                  id="inputUsuario"
                  className="form-control form-select"
                  value={idUsuario}
                  onChange={(e) => setIdUsuario(e.target.value)}
                >
                  <option value="">Selecione um usuário</option>
                  {usuarios.map(user => (
                    <option key={user.id} value={user.id}>{user.nome}</option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label='Data de Compra: *' htmlFor='inputDataCompra'>
                <input
                  type='date'
                  id='inputDataCompra'
                  value={dataCompra}
                  className='form-control'
                  onChange={(e) => setDataCompra(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Status da Compra: *' htmlFor='inputStatus'>
                <select
                  id="inputStatus"
                  className="form-control form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="FINALIZADA">Finalizada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </FormGroup>
              
              <hr />
              <h5>Itens da Compra</h5>
              <table className='table table-hover table-striped mt-3'>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço Unitário</th>
                    <th>Subtotal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {itensDeCompra.map((item, index) => (
                    <tr key={index}>
                      <td style={{width: '40%'}}>
                        <select
                          className='form-control form-select'
                          value={item.idProduto}
                          onChange={(e) => handleItemChange(index, 'idProduto', e.target.value)}
                        >
                          <option value="">Selecione</option>
                          {produtos.map(p => (
                            <option key={p.id} value={p.id}>{p.nome}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{width: '15%'}}>
                        <input
                          type='number'
                          className='form-control'
                          value={item.quantidade}
                          min="1"
                          onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                        />
                      </td>
                      <td>{(Number(item.precoUnitario) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>{( (Number(item.quantidade) || 0) * (Number(item.precoUnitario) || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>
                        <IconButton aria-label='delete' onClick={() => excluirItem(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                        <td colSpan="2"><strong>{calcularTotal()}</strong></td>
                    </tr>
                </tfoot>
              </table>
              <button onClick={adicionarItem} type='button' className='btn btn-info mb-3'>
                Adicionar Item
              </button>

              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={salvar} type='button' className='btn btn-success' disabled={isSaving}>
                  {isSaving ? 'Salvando...' : 'Salvar Compra'}
                </button>
                <button onClick={() => navigate('/listagem-compras')} type='button' className='btn btn-danger'>
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

export default CadastroCompra;