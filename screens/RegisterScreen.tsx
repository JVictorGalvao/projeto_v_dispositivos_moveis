import React, { useState } from 'react';
import { Appbar, Button, HelperText, TextInput } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { Separator } from '../components/Separator';
import api from '../service/api';
import { RootStackScreenProps } from '../types';

export default function RegisterScreen({
  navigation,
}: RootStackScreenProps<'Registro'>) {
  const [nome, setNome] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState(false);
  const hasErrors = () => senha !== confirmacao;
  const registrar = () => {
    if (hasErrors()) {
      setErro(true);
    } else {
      setErro(false);
      api
        .post('/users', {
          nome: nome,
          email: email,
          password: senha,
          data_nascimento: dataNasc,
        })
        .then(() => navigation.navigate('Login'));
    }
  };

  return (
    <>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Registro" />
      </Appbar.Header>
      <ScreenContainer>
        <Separator vertical size={64} />
        <TextInput
          label="Nome completo"
          mode="outlined"
          value={nome}
          onChangeText={(nome) => setNome(nome)}
        />
        <Separator vertical size={16} />
        <TextInput
          label="Data de nascimento"
          mode="outlined"
          keyboardType="numeric"
          value={dataNasc}
          onChangeText={(dataNasc) => setDataNasc(dataNasc)}
        />

        <Separator vertical size={16} />
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />
        <Separator vertical size={16} />
        <TextInput
          label="Senha"
          secureTextEntry
          mode="outlined"
          value={senha}
          onChangeText={(senha) => setSenha(senha)}
        />
        <Separator vertical size={16} />

        <TextInput
          label="Confirmação de senha"
          mode="outlined"
          secureTextEntry
          value={confirmacao}
          onChangeText={(confirmacao) => setConfirmacao(confirmacao)}
        />
        <HelperText type="error" visible={erro}>
          As senhas não coincidem
        </HelperText>
        <Separator vertical size={64} />
        <Button
          mode="contained"
          onPress={() => {
            registrar();
          }}
        >
          Inscrever-se
        </Button>
      </ScreenContainer>
    </>
  );
}
