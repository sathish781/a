import React from 'react';
import { View, StyleSheet } from 'react-native';

import { radius } from '../utils/theme';
import { useThemeMode } from '../context/ThemeContext';

export default function GlassCard({ children, style }) {
  const { theme } = useThemeMode();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.glass,
          borderColor: theme.glassBorder,
          shadowColor: theme.cardShadow,
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
    borderWidth: 1,
    padding: 18,
    marginVertical: 9,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
    overflow: 'hidden',
  },
});