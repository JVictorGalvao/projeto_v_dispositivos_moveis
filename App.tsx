/* eslint-disable react/style-prop-object */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#f1c40f',
    },
  };

  if (!isLoadingComplete) {
    return null;
  }
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar translucent={false} style="auto" backgroundColor="white" />
        <Navigation colorScheme={colorScheme} />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
