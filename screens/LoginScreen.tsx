import React, { useState } from 'react';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { Separator } from '../components/Separator';
import api from '../service/api';
import { RootStackScreenProps } from '../types';

export default function LoginScreen({
  navigation,
}: RootStackScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);

  const login = () => {
    api.post('/login', { email: email, password: senha }).then(
      (response) =>
        navigation.navigate('Home', {
          id: response.data.user.id,
          nome: response.data.user.nome,
          dataNasc: response.data.user.data_nascimento,
          email: response.data.user.email,
        }),
      () => setErro(true)
    );
  };
  return (
    <ScreenContainer>
      <Separator vertical size={256} />
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />
      <Separator vertical size={8} />
      <TextInput
        label="Senha"
        mode="outlined"
        secureTextEntry
        value={senha}
        onChangeText={(senha) => setSenha(senha)}
      />
      <HelperText type="error" visible={erro}>
        Usuário ou senha incorretos.
      </HelperText>
      <Separator vertical size={32} />

      <Button mode="contained" onPress={() => login()}>
        Login
      </Button>
      <Separator vertical size={64} />
      <Button mode="text" onPress={() => navigation.navigate('Registro')}>
        Não tem conta? Registre-se
      </Button>
    </ScreenContainer>
  );
}
