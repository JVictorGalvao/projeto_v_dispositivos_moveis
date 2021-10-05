import React from 'react';
import { Button, TextInput } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { Separator } from '../components/Separator';
import { RootStackScreenProps } from '../types';

export default function LoginScreen({
  navigation,
}: RootStackScreenProps<'Login'>) {
  return (
    <ScreenContainer>
      <Separator vertical size={256} />
      <TextInput label="Email" mode="outlined" />
      <Separator vertical size={8} />
      <TextInput label="Senha" mode="outlined" />
      <Separator vertical size={32} />
      <Button mode="contained" onPress={() => console.log('Pressed')}>
        Login
      </Button>
      <Separator vertical size={64} />
      <Button mode="text" onPress={() => navigation.navigate('Registro')}>
        Não tem conta? Registre-se
      </Button>
    </ScreenContainer>
  );
}
