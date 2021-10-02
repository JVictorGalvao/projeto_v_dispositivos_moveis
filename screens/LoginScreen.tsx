import React from 'react';
import { Text } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackScreenProps } from '../types';

export default function LoginScreen({
  navigation,
}: RootStackScreenProps<'Login'>) {
  return (
    <ScreenContainer>
      <Text>Tab One</Text>
    </ScreenContainer>
  );
}
