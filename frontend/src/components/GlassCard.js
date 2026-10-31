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
          backgroundColor: theme.glass,
          borderColor: theme.glassBorder,
          shadowColor: isLight ? theme.darkText : theme.primary,
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