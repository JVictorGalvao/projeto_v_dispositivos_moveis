/* eslint-disable no-else-return */
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Appbar, Text } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackScreenProps } from '../types';

type IRotas = {
  Agendamentos: {
    tela?: boolean;
  };
};

export default function AgendamentosScreen({
  navigation,
}: RootStackScreenProps<'Agendamentos'>) {
  const route = useRoute<RouteProp<IRotas, 'Agendamentos'>>();
  console.log(route.params.tela);
  return (
    <>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction
          onPress={
            route.params.tela
              ? () => navigation.pop(2)
              : () => navigation.goBack()
          }
        />
        <Appbar.Content title="Meus agendamentos" />
      </Appbar.Header>
      <ScreenContainer>
        <Text>Meus agendamentos</Text>
      </ScreenContainer>
    </>
  );
}
