import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AnimatedBackground from './animations/AnimatedBackground';
import { useThemeMode } from '../context/ThemeContext';

export default function GlassScreen({ children }) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  return (
    <AnimatedBackground intensity="subtle" style={{ flex: 1, height: '100%', minHeight: '100%' }}>
      <StatusBar
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safe}>
        {children}
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    height: '100%',
  },
});
