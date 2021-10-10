import React from 'react';
import { Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackScreenProps } from '../types';

export default function AgendamentoScreen({
  navigation,
}: RootStackScreenProps<'Agendamento'>) {
  return (
    <>
      <ScreenContainer>
        <Appbar.Header statusBarHeight={0}>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="Agendamento" />
        </Appbar.Header>
        <Text>Agendamento</Text>
      </ScreenContainer>
      ;
    </>
  );
}
