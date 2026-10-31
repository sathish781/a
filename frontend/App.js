import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useThemeMode } from './src/context/ThemeContext';
import { ToastProvider } from './src/context/ToastContext';
import AppNavigator from './src/navigation/AppNavigator';

enableScreens(false);

function RootApp() {
  const { theme, themeMode } = useThemeMode();

  return (
    <View style={[styles.fill, { backgroundColor: theme.backgroundOne }]}>
      <NavigationContainer>
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} translucent={false} />
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider style={styles.fill}>
          <ToastProvider>
            <RootApp />
          </ToastProvider>
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
