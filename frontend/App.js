import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useThemeMode } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

function RootApp() {
  const { themeMode } = useThemeMode();

  return (
    <NavigationContainer>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootApp />
      </AuthProvider>
    </ThemeProvider>
  );
}