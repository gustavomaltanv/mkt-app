import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

import Card from '../components/Card';
import FormGroup from '../components/FormGroup';

import { mensagemSucesso, mensagemErro } from '../components/Toastr';


import axios from 'axios';
import { BASE_URL, BASE_URL3 } from '../config/axios';

const baseURLProdutos = `${BASE_URL}/produtos`;
const baseURL = `${BASE_URL3}/compras`;

function CadastroCompra() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [usuario, setUsuario] = useState('');
  const [dataCompra, setDataCompra] = useState(new Date());
  const [statusCarrinho, setStatusCarrinho] = useState('');
  const [total, setTotal] = useState('');
  const [itensDeCompra, setItensDeCompra] = useState([]);
  const [tipoPagamento, setTipoPagamento] = useState('');
  const [statusPagamento, setStatusPagamento] = useState('');
  const [dados, setDados] = useState({});
  const [produtos, setProdutos] = useState([]);

  function inicializar() {
    if (idParam == null) {
      setId('');
      setUsuario('');
      setDataCompra(today.getDate());
      setStatusCarrinho('');
      setTotal('');
      setItensDeCompra([]);
      setTipoPagamento('');
      setStatusPagamento('');
    }
    else {
      setId(dados.id);
      setUsuario(dados.nome);
      setDataCompra(dados.dataCompra);
      setStatusCarrinho(dados.statusCarrinho);
      setTotal(dados.total);
      setItensDeCompra(dados.itensDeCompra);
      setTipoPagamento(dados.pagamento.tipoPagamento ? dados.pagamento.tipoPagamento : '');
      setStatusPagamento(dados.pagamento.setStatusPagamento ? dados.pagamento.setStatusPagamento : '');

    }
  }

  async function salvar() {
    let data = {
      id,
      usuario,
      dataCompra,
      statusCarrinho,
      total,
      itensDeCompra,
      pagamento: {
        tipoPagamento,
        statusPagamento,
      },
    };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(function (response) {
          mensagemSucesso(`Compra ${nome} cadastrado(a) com sucesso!`)
          navigate(`/listagem-compras`);
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
          mensagemSucesso(`Compra ${id} alterado(a) com sucesso!`);
          navigate(`/listagem-compras`);
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
        setId(response.data.id);
        setUsuario(response.data.nome);
        setDataCompra(response.data.dataCompra);
        setStatusCarrinho(response.data.statusCarrinho);
        setTotal(response.data.total);
        setItensDeCompra(response.data.itensDeCompra);
        setTipoPagamento(response.data.pagamento.tipoPagamento ? response.data.pagamento.tipoPagamento : '');
        setStatusPagamento(response.data.pagamento.setStatusPagamento ? response.data.pagamento.setStatusPagamento : '');
      });
    }
  }

  const setSelectValue = (selectId, value) => {
    const selectElement = document.getElementById(selectId);
    if (selectElement) {
      selectElement.value = value;
    }
  };

  const getProdutos = async () => {
    const response = await axios.get(`${baseURLProdutos}`);
    setProdutos(response.data);
  };

  const excluirItem = (index) => {
    const updatedItens = [...itensDeCompra];
    updatedItens.splice(index, 1);
    setItensDeCompra(updatedItens);
  }

  const adicionarItem = () => {
    setItensDeCompra([...itensDeCompra, { idProduto: '', nomeProduto: '', quantidade: 1, precoUnitario: 0 }]);
  }

  useEffect(() => {
    getProdutos();
  }, []);

  useEffect(() => {
    buscar();
    setSelectValue('inputTipoPagamento', tipoPagamento);
    setSelectValue('inputStatusPagamento', statusPagamento);
  }, [id]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Compra'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Usuário:' htmlFor='inputUsuario'>
                <input
                  type='text'
                  id='inputUsuario'
                  value={usuario}
                  className='form-control'
                  name='usuario'
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Data de Compra:' htmlFor='inputDataCompra'>
                <input
                  type='date'
                  id='inputDataCompra'
                  value={dataCompra}
                  className='form-control'
                  name='dataCompra'
                  onChange={(e) => setDataCompra(e.target.value)}
                />
              </FormGroup>

              <FormGroup label='Total:' htmlFor='inputTotal'>
                <input
                  type="number"
                  id="inputTotal"
                  value={total}
                  className="form-control"
                  name="total"
                  onChange={(e) => setTotal(e.target.value)}
                />
              </FormGroup>

              {/* <FormGroup label='Status:' htmlFor='inputStatusCarrinho'>
                <select
                  id='inputStatusCarrinho'
                  value={statusCarrinho}
                  className='form-control'
                  name='statusCarrinho'
                  onChange={(e) => setStatusCarrinho(e.target.value)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </FormGroup> */}

              <FormGroup label='Método de Pagamento:' htmlFor='inputTipoPagamento'>
                <select
                  type='number'
                  id='inputTipoPagamento'
                  value={tipoPagamento}
                  className='form-control form-select'
                  name='codigoBarras'
                  onChange={(e) => setTipoPagamento(e.target.value)}
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Boleto">Boleto</option>
                </select>
              </FormGroup>

              <FormGroup label='Status do Pagamento:' htmlFor='inputStatusPagamento'>
                <select
                  id='inputStatusPagamento'
                  value={statusPagamento}
                  className='form-control'
                  name='statusCarrinho'
                  onChange={(e) => setStatusPagamento(e.target.value)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Recusado">Recusado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </FormGroup>

              <table className='table table-hover table-striped mt-4'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Preço Unitário</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {itensDeCompra.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <select
                          id={`produto-${index}`}
                          value={item.idProduto}
                          className='form-control'
                          onChange={(e) => {
                            const updatedItens = [...itensDeCompra];
                            updatedItens[index].idProduto = e.target.value;
                            setItensDeCompra(updatedItens);
                          }}
                        >
                          <option value="">Selecione o produto</option>
                          {produtos.map((produto) => (
                            <option key={produto.id} value={produto.id}>
                              {produto.nome}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type='number'
                          id={`quantidade-${index}`}
                          value={item.quantidade}
                          className='form-control'
                          onChange={(e) => {
                            const updatedItens = [...itensDeCompra];
                            updatedItens[index].quantidade = e.target.value;
                            setItensDeCompra(updatedItens);
                          }}
                        />
                      </td>
                      <td>{item.precoUnitario.toFixed(2)}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton aria-label='delete' disabled={statusPagamento === "Finalizado"} onClick={() => excluirItem(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              <button
                onClick={adicionarItem}
                type='button'
                className='btn btn-info'
              >
                Adicionar Item
              </button>

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

export default CadastroCompra;
