import React from 'react';
import { StyleSheet, View } from 'react-native';

import { radius } from '../utils/theme';
import { useThemeMode } from '../context/ThemeContext';

export default function GlassCard({ children, style }) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isLight ? '#ffffff' : 'rgba(16, 17, 30, 0.85)',
          borderColor: isLight ? 'rgba(226, 232, 240, 0.9)' : 'rgba(99, 102, 241, 0.28)',
          shadowColor: isLight ? '#0f172a' : '#6366f1',
          shadowOpacity: isLight ? 0.08 : 0.28,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: 20,
    marginVertical: 10,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
    overflow: 'hidden',
  },
});