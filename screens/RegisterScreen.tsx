import React from 'react';
import { TextInput } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackScreenProps } from '../types';

export default function RegisterScreen({
  navigation,
}: RootStackScreenProps<'Registro'>) {
  return (
    <ScreenContainer>
      <TextInput label="Email" mode="outlined" />
      <TextInput label="Email" mode="outlined" />
    </ScreenContainer>
  );
}
