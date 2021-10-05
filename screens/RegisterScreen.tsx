import React from 'react';
import { Appbar, Button, TextInput } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { Separator } from '../components/Separator';
import { RootStackScreenProps } from '../types';

export default function RegisterScreen({
  navigation,
}: RootStackScreenProps<'Registro'>) {
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
        <TextInput label="Nome completo" mode="outlined" />
        <Separator vertical size={16} />
        <TextInput label="Data de nascimento" mode="outlined" />
        <Separator vertical size={16} />
        <TextInput label="Email" mode="outlined" />
        <Separator vertical size={16} />
        <TextInput label="Senha" secureTextEntry mode="outlined" />
        <Separator vertical size={16} />

        <TextInput
          label="Confirmação de senha"
          mode="outlined"
          secureTextEntry
        />
        <Separator vertical size={64} />
        <Button mode="contained" onPress={() => console.log('Pressed')}>
          Inscrever-se
        </Button>
      </ScreenContainer>
    </>
  );
}
