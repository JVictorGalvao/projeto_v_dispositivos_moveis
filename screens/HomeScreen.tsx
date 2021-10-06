import React from 'react';
import { Button } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { Separator } from '../components/Separator';
import { RootStackScreenProps } from '../types';

export default function HomeScreen({
  navigation,
}: RootStackScreenProps<'Home'>) {
  return (
    <ScreenContainer>
      <Separator vertical size={256} />
      <Button mode="text">Não tem conta? Registre-se</Button>
    </ScreenContainer>
  );
}
