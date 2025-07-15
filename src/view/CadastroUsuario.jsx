import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Card from '../components/Card';
import FormGroup from '../components/FormGroup';
import { mensagemSucesso, mensagemErro } from '../components/Toastr';
import { BASE_URL } from '../config/axios'; // Assumindo que BASE_URL está configurado para http://localhost:8080/api/v1

import Stack from '@mui/material/Stack';

const baseURL = `${BASE_URL}/usuarios`;

function CadastroUsuario() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const isNewUser = idParam === undefined;

  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');

  // Busca os dados do usuário para edição
  useEffect(() => {
    if (!isNewUser) {
      axios.get(`${baseURL}/${idParam}`)
        .then(response => {
          const { data } = response;
          setNome(data.nome);
          setCpf(data.cpf);
          setEmail(data.email);
          setTelefone(data.telefone);
          setDataNascimento(data.dataNascimento || '');
          setEstado(data.estado);
          setCidade(data.cidade);
          setBairro(data.bairro);
          setLogradouro(data.logradouro);
          setNumero(data.numero);
          setComplemento(data.complemento || '');
        })
        .catch(error => {
          mensagemErro('Usuário não encontrado.');
          navigate('/listagem-usuarios');
        });
    }
  }, [idParam, isNewUser, navigate]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const salvar = async () => {
    const dataAtual = getTodayDate();
    const data = {
      nome,
      email,
      telefone,
      cpf,
      dataNascimento,
      estado,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento,
      dataAtualizacao: dataAtual
    };

    let request;
    let successMessage;

    if (isNewUser) {
      data.dataCadastro = dataAtual;
      request = axios.post(baseURL, data);
      successMessage = `Usuário ${nome} cadastrado com sucesso!`;
    } else {
      request = axios.put(`${baseURL}/${idParam}`, data);
      successMessage = `Usuário ${nome} atualizado com sucesso!`;
    }

    try {
      await request;
      mensagemSucesso(successMessage);
      navigate('/listagem-usuarios');
    } catch (error) {
      mensagemErro(error.response?.data || 'Ocorreu um erro ao salvar.');
    }
  };
  
  const cancelar = () => {
      navigate('/listagem-usuarios');
  }

  return (
    <div className='container'>
      <Card title={isNewUser ? 'Cadastro de Usuário' : 'Edição de Usuário'}>
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
              <FormGroup label='Telefone: *' htmlFor='inputTelefone'>
                <input
                  type='tel'
                  id='inputTelefone'
                  value={telefone}
                  className='form-control'
                  name='telefone'
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='E-mail: *' htmlFor='inputEmail'>
                <input
                  type='email'
                  id='inputEmail'
                  value={email}
                  className='form-control'
                  name='email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='CPF: *' htmlFor='inputCpf'>
                <input
                  type='text'
                  id='inputCpf'
                  value={cpf}
                  className='form-control'
                  name='cpf'
                  onChange={(e) => setCpf(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Estado: *' htmlFor='inputEstado'>
                <input
                  type='text'
                  id='inputEstado'
                  value={estado}
                  className='form-control'
                  name='estado'
                  onChange={(e) => setEstado(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Cidade: *' htmlFor='inputCidade'>
                <input
                  type='text'
                  id='inputCidade'
                  value={cidade}
                  className='form-control'
                  name='cidade'
                  onChange={(e) => setCidade(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Bairro: *' htmlFor='inputBairro'>
                <input
                  type='text'
                  id='inputBairro'
                  value={bairro}
                  className='form-control'
                  name='bairro'
                  onChange={(e) => setBairro(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Logradouro: *' htmlFor='inputLogradouro'>
                <input
                  type='text'
                  id='inputLogradouro'
                  value={logradouro}
                  className='form-control'
                  name='logradouro'
                  onChange={(e) => setLogradouro(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Número: *' htmlFor='inputNumero'>
                <input
                  type='text'
                  id='inputNumero'
                  value={numero}
                  className='form-control'
                  name='numero'
                  onChange={(e) => setNumero(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Complemento:' htmlFor='inputComplemento'>
                <input
                  type='text'
                  id='inputComplemento'
                  value={complemento}
                  className='form-control'
                  name='complemento'
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Data de Nascimento: *' htmlFor='inputDataNascimento'>
                <input
                  type='date'
                  id='inputDataNascimento'
                  value={dataNascimento}
                  className='form-control'
                  name='dataNascimento'
                  onChange={(e) => setDataNascimento(e.target.value)}
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
                  onClick={cancelar}
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

export default CadastroUsuario;