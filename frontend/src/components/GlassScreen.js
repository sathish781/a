import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeMode } from '../context/ThemeContext';

export default function GlassScreen({ children }) {
  const { theme } = useThemeMode();

  return (
    <LinearGradient
      colors={[
        theme.backgroundOne,
        theme.backgroundTwo,
        theme.backgroundThree,
      ]}
      style={styles.gradient}
    >
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <View
        style={[
          styles.blobOne,
          {
            backgroundColor:
              theme.mode === 'dark'
                ? 'rgba(56,189,248,0.30)'
                : 'rgba(37,99,235,0.20)',
          },
        ]}
      />

      <View
        style={[
          styles.blobTwo,
          {
            backgroundColor:
              theme.mode === 'dark'
                ? 'rgba(168,85,247,0.30)'
                : 'rgba(168,85,247,0.20)',
          },
        ]}
      />

      <View
        style={[
          styles.blobThree,
          {
            backgroundColor:
              theme.mode === 'dark'
                ? 'rgba(34,197,94,0.16)'
                : 'rgba(34,197,94,0.12)',
          },
        ]}
      />

      <SafeAreaView style={styles.safe}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  blobOne: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    top: -80,
    right: -90,
  },
  blobTwo: {
    position: 'absolute',
    width: 330,
    height: 330,
    borderRadius: 165,
    bottom: -130,
    left: -140,
  },
  blobThree: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    top: 270,
    left: 36,
  },
});